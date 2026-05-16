type Environment = Record<string, string | undefined>;

export type NotiflyConfig = {
  ready: true;
  projectId: string;
  username: string;
  allowUserSuppliedLogEvent: boolean;
};

export type MissingNotiflyConfig = {
  ready: false;
  missingFields: string[];
  invalidFields: string[];
};

const requiredFields = ["NEXT_PUBLIC_NOTIFLY_PROJECT_ID", "NEXT_PUBLIC_NOTIFLY_PROJECT_USERNAME"] as const;

const publicEnvironment: Environment = {
  NEXT_PUBLIC_NOTIFLY_PROJECT_ID: process.env.NEXT_PUBLIC_NOTIFLY_PROJECT_ID,
  NEXT_PUBLIC_NOTIFLY_PROJECT_USERNAME: process.env.NEXT_PUBLIC_NOTIFLY_PROJECT_USERNAME,
  NEXT_PUBLIC_NOTIFLY_ALLOW_USER_SUPPLIED_LOG_EVENT: process.env.NEXT_PUBLIC_NOTIFLY_ALLOW_USER_SUPPLIED_LOG_EVENT,
};

export function validateProjectId(projectId: string) {
  return /^(?:[0-9a-fA-F]{32})$/.test(projectId);
}

export function getNotiflyConfig(environment: Environment = publicEnvironment): NotiflyConfig | MissingNotiflyConfig {
  const missingFields = requiredFields.filter((field) => !environment[field]?.trim());
  const projectId = environment.NEXT_PUBLIC_NOTIFLY_PROJECT_ID?.trim() ?? "";
  const invalidFields = projectId && !validateProjectId(projectId) ? ["NEXT_PUBLIC_NOTIFLY_PROJECT_ID"] : [];

  if (missingFields.length > 0 || invalidFields.length > 0) {
    return {
      ready: false,
      missingFields,
      invalidFields,
    };
  }

  return {
    ready: true,
    projectId,
    username: environment.NEXT_PUBLIC_NOTIFLY_PROJECT_USERNAME!.trim(),
    allowUserSuppliedLogEvent: environment.NEXT_PUBLIC_NOTIFLY_ALLOW_USER_SUPPLIED_LOG_EVENT === "true",
  };
}
