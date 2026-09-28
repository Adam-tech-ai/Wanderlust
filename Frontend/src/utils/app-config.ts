class AppConfig {

    // Backend register endpoint:
    public readonly registerUrl =
        "http://localhost:4000/api/register";

    // Backend login endpoint:
    public readonly loginUrl =
        "http://localhost:4000/api/login";

    // Backend vacations endpoint:
    public readonly vacationsUrl =
        "http://localhost:4000/api/vacations";

    // Backend reports endpoint:
    public readonly reportsUrl =
        "http://localhost:4000/api/reports";

    // Google reCAPTCHA site key:
    public readonly recaptchaSiteKey =
        import.meta.env.VITE_RECAPTCHA_SITE_KEY;
}

export const appConfig = new AppConfig();