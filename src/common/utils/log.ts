export const Log = ({
  message,
  error = false,
  info = false,
  exceptTest = true,
  exceptProduction = false,
}) => {
  let respon = [];
  if (
    (exceptTest && process.env.NODE_ENV === 'test') ||
    (exceptProduction && process.env.NODE_ENV === 'production')
  )
    return;

  if (Array.isArray(message)) respon = message;
  else respon.push(message);

  if (error) console.error(...respon);
  else if (info) console.info(...respon);
  else console.log(...respon);
};
