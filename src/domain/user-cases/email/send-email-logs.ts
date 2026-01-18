import { EmailService } from "../../../presentation/email/email.service";
import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";

interface SendLogEmailUseCase {
  execute: (to: string | string[]) => Promise<boolean>;
}

export class SendEmailLogs implements SendLogEmailUseCase {
  constructor(
    private readonly emailService: EmailService,
    private readonly logRepository: LogRepository,
  ) {}

  async execute(to: string | string[]) {
    try {
      const sent = await this.emailService.sendEmailWithFileSystemLogs(to);
      if (!sent) {
        throw new Error("Email log not sent");
      }

      this.sendLog("Log email sent", LogSeverityLevel.low);
      return true;
    } catch (error) {
      this.sendLog(`${error}`, LogSeverityLevel.high);
      return false;
    }
  }

  private sendLog(message: string, level: LogSeverityLevel) {
    const log = new LogEntity({
      message: message,
      level: level,
      origin: "send-email-logs.ts",
    });
    this.logRepository.saveLog(log);
  }
}
