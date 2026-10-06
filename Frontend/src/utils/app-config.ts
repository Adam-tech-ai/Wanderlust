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

    // Backend AI recommendation endpoint:
    public readonly aiRecommendationUrl =
        "http://localhost:4000/api/ai-recommendation";

    // Backend MCP question endpoint:
    public readonly mcpQuestionUrl =
        "http://localhost:4000/api/mcp-question";

    // Backend vacation images path:
    public readonly imagesUrl =
        "http://localhost:4000/api/images";

    // Google reCAPTCHA site key:
    public readonly recaptchaSiteKey =
        import.meta.env.VITE_RECAPTCHA_SITE_KEY;
}

export const appConfig = new AppConfig();