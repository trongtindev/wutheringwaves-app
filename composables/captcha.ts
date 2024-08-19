declare global {
  const grecaptcha: {
    execute: (key: string, options?: any) => Promise<string>;
  };
}

export const useCaptcha = defineStore('useCaptcha', () => {
  // functions
  const execute = async (options: { action: string }): Promise<string> => {
    return await grecaptcha.execute('RECAPTCHA_SITE_KEY', options);
  };

  return { execute };
});
