import { CronService } from "./cron/cron-service";
import { CheckService } from "../domain/user-cases/checks/check-service";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.imp";
import { FileSystemDatasource } from "../infrastructure/datasources/File-system.datasource";
import { envs } from "../config/plugins/envs.plugin";
import { EmailService } from "./email/email.service";
import { SendEmailLogs } from "../domain/user-cases/email/send-email-logs";

const fileSystemLogRepository = new LogRepositoryImpl(new FileSystemDatasource());
const emailService = new EmailService();

export class Server {
  public static start() {
    console.log("Server started...");

    new SendEmailLogs(emailService, fileSystemLogRepository).execute([
      envs.MAILER_RECEIVER,
    ]);
    // emailService.sendEmailWithFileSystemLogs([envs.MAILER_RECEIVER]);

    // CronService.createJob("*/5 * * * * *", () => {
    //   const url = "https://google.com";
    //   new CheckService(
    //     fileSystemLogRepository,
    //     () => console.log(`${url} is ok`),
    //     (error) => console.log(error),
    //   ).execute(url);
    // });
  }
}
