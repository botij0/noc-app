import { CronService } from "./cron/cron-service";
import { CheckService } from "../domain/user-cases/checks/check-service";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.imp";
import { FileSystemDatasource } from "../infrastructure/datasources/File-system.datasource";
import { envs } from "../config/plugins/envs.plugin";
import { EmailService } from "./email/email.service";
import { SendEmailLogs } from "../domain/user-cases/email/send-email-logs";
import { MongoLogDatasource } from "../infrastructure/datasources/mongo-log.datasource";
import { LogSeverityLevel } from "../domain/entities/log.entity";
import { PostgresLogDatasource } from "../infrastructure/datasources/postgres-log.datasource";
import { CheckServiceMultiple } from "../domain/user-cases/checks/check-service-multiple";

const fsLogRepository = new LogRepositoryImpl(new FileSystemDatasource());
const mongoLogRepository = new LogRepositoryImpl(new MongoLogDatasource());
const postgresLogRepository = new LogRepositoryImpl(new PostgresLogDatasource());
const emailService = new EmailService();

export class Server {
  public static async start() {
    console.log("Server started...");

    // new SendEmailLogs(emailService, fileSystemLogRepository).execute([
    //   envs.MAILER_RECEIVER,
    // ]);
    // emailService.sendEmailWithFileSystemLogs([envs.MAILER_RECEIVER]);

    // const logs = await mongoLogRepository.getLogs(LogSeverityLevel.low);
    // console.log(logs);

    CronService.createJob("*/5 * * * * *", () => {
      const url = "https://google.com";

      new CheckServiceMultiple(
        [fsLogRepository, postgresLogRepository, mongoLogRepository],
        () => console.log(`${url} is ok`),
        (error) => console.log(error),
      ).execute(url);
    });
  }
}
