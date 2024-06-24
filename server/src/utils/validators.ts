const validatePassword = (password: string) => {
  const strictRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;

  return strictRegex.test(password);
};

export { validatePassword };
