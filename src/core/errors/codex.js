/**
 * Machine-Readable Troubleshooting & Diagnostics Codex
 * Maps error codes to detailed human & machine readable solutions.
 */

export const ERROR_CODEX = {
  "CFG-001": {
    code: "CFG-001",
    category: "Configuration",
    message: "Missing essential environment variable",
    cause: "DISCORD_TOKEN or CLIENT_ID is not configured in environment or .env file",
    fix: "Populate DISCORD_TOKEN and CLIENT_ID in your environment variables.",
    arabicMessage: "متغير بيئة أساسي مفقود (DISCORD_TOKEN أو CLIENT_ID)."
  },
  "CFG-002": {
    code: "CFG-002",
    category: "Configuration",
    message: "Invalid Bot Token",
    cause: "The DISCORD_TOKEN provided was rejected by Discord API",
    fix: "Regenerate the bot token in Discord Developer Portal and update DISCORD_TOKEN.",
    arabicMessage: "رمز التوكن الخاص بالبوت غير صالح."
  },
  "DB-001": {
    code: "DB-001",
    category: "Database",
    message: "MongoDB connection string missing",
    cause: "MONGO_URI is empty or undefined",
    fix: "Provide MONGO_URI in .env. Bot will degrade gracefully to in-memory JSON cache.",
    arabicMessage: "رابط اتصال قاعدة البيانات MongoDB مفقود."
  },
  "DB-002": {
    code: "DB-002",
    category: "Database",
    message: "Cannot connect to MongoDB Atlas cluster",
    cause: "IP Address not whitelisted or network timeout",
    fix: "Whitelist 0.0.0.0/0 in MongoDB Atlas Network Access settings.",
    arabicMessage: "فشل الاتصال بقاعدة البيانات. تأكد من إضافة 0.0.0.0/0 للقائمة المسموحة في Atlas."
  },
  "AUD-001": {
    code: "AUD-001",
    category: "Audio",
    message: "Lavalink Node Unreachable",
    cause: "Audio node connection failed or offline",
    fix: "Check LAVALINK_HOST settings or rely on auto-discovery. Music modules gracefully pause while rest of bot operates normally.",
    arabicMessage: "عقدة Lavalink الصوتية غير متاحة. تم إيقاف الصوت تلقائياً مع استمرار باقي الخصائص."
  },
  "AI-001": {
    code: "AI-001",
    category: "AI",
    message: "No AI Provider Key Configured",
    cause: "GEMINI_API_KEY, OPENROUTER_API_KEY, and OPENAI_API_KEY are missing",
    fix: "Set GEMINI_API_KEY in environment variables. Coach falls back to grounded hero database logic.",
    arabicMessage: "لم يتم توفير مفتاح لمزود الذكاء الاصطناعي."
  },
  "PRM-002": {
    code: "PRM-002",
    category: "Permissions",
    message: "Bot missing required Discord permissions",
    cause: "Missing Manage Roles, Embed Links, or Voice Connect permissions",
    fix: "Re-invite bot using the derived invite link with appropriate scope/permissions.",
    arabicMessage: "البوت يفتقد لصلاحيات إدارية كافية في السيرفر."
  },
  "DSC-001": {
    code: "DSC-001",
    category: "Discord",
    message: "Interaction expired before response",
    cause: "Command response took longer than 3 seconds without deferral",
    fix: "Call deferReply() before undertaking asynchronous API calls.",
    arabicMessage: "انتهت مهلة تفاعل الديسكورد قبل الرد."
  }
};
