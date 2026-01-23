

export class AppError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, fields = []) {
    super(message, 400, fields);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Não autorizado') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Erro de conexão. Verifique sua internet.') {
    super(message, 0);
    this.name = 'NetworkError';
  }
}


const HTTP_ERROR_MESSAGES = {
  400: 'Dados inválidos. Verifique as informações enviadas.',
  401: 'Sessão expirada. Faça login novamente.',
  403: 'Você não tem permissão para realizar esta ação.',
  404: 'Recurso não encontrado.',
  408: 'Tempo de requisição esgotado. Tente novamente.',
  409: 'Conflito de dados. Este recurso já existe.',
  422: 'Dados inválidos. Verifique os campos.',
  429: 'Muitas tentativas. Aguarde alguns instantes.',
  500: 'Erro no servidor. Tente novamente mais tarde.',
  502: 'Servidor temporariamente indisponível.',
  503: 'Serviço em manutenção. Tente novamente em breve.',
};


const CONTEXT_ERROR_MESSAGES = {
  login: {
    401: 'Email ou senha incorretos.',
    404: 'Usuário não encontrado.',
    422: 'Email ou senha inválidos.',
  },
  register: {
    409: 'Este email ou usuário já está cadastrado.',
    422: 'Senha deve ter no mínimo 8 caracteres com letras e números.',
  },
  workout: {
    404: 'Treino não encontrado.',
    403: 'Você não tem permissão para editar este treino.',
  },
};


export function getErrorMessage(error, context = null) {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão.';
  }

  if (error.name === 'NetworkError' || !navigator.onLine) {
    return 'Sem conexão com a internet. Verifique sua rede.';
  }

  if (error.name === 'AbortError') {
    return 'Requisição demorou muito. Tente novamente.';
  }

  if (error instanceof AppError) {
    return error.message;
  }

  if (error.statusCode && context && CONTEXT_ERROR_MESSAGES[context]?.[error.statusCode]) {
    return CONTEXT_ERROR_MESSAGES[context][error.statusCode];
  }

  if (error.statusCode && HTTP_ERROR_MESSAGES[error.statusCode]) {
    return HTTP_ERROR_MESSAGES[error.statusCode];
  }

  if (error.message) {
    return error.message;
  }

  return 'Ocorreu um erro inesperado. Tente novamente.';
}


export function validateField(name, value, rules = {}) {
  const errors = [];

  if (rules.required) {
    const isString = typeof value === 'string';
    const isEmpty = value === null || value === undefined || (isString && !value.trim());

    if (isEmpty) {
      errors.push(`${name} é obrigatório.`);
    }
  }

  if (rules.email && value && !isValidEmail(String(value))) {
    errors.push('Email inválido.');
  }

  if (rules.minLength && value && String(value).length < rules.minLength) {
    errors.push(`${name} deve ter no mínimo ${rules.minLength} caracteres.`);
  }

  if (rules.maxLength && value && String(value).length > rules.maxLength) {
    errors.push(`${name} deve ter no máximo ${rules.maxLength} caracteres.`);
  }

  if (rules.min && value && Number(value) < rules.min) {
    errors.push(`${name} deve ser no mínimo ${rules.min}.`);
  }

  if (rules.max && value && Number(value) > rules.max) {
    errors.push(`${name} deve ser no máximo ${rules.max}.`);
  }

  if (rules.pattern && value && !rules.pattern.test(String(value))) {
    errors.push(rules.patternMessage || `${name} inválido.`);
  }

  if (rules.custom && value) {
    const customError = rules.custom(value);
    if (customError) errors.push(customError);
  }

  return errors;
}


export function validateForm(data, rules) {
  const errors = {};
  let hasErrors = false;

  Object.keys(rules).forEach((field) => {
    const fieldErrors = validateField(field, data[field], rules[field]);
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
      hasErrors = true;
    }
  });

  return { isValid: !hasErrors, errors };
}


export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isStrongPassword(password) {
  // Mínimo 8 caracteres, pelo menos uma letra e um número
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
}

export function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}


export function logError(error, context = {}) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    message: error.message,
    name: error.name,
    statusCode: error.statusCode,
    stack: error.stack,
    context,
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  return errorLog;
}

export async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Não fazer retry em erros de validação
      if (error.statusCode >= 400 && error.statusCode < 500) {
        throw error;
      }

      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
