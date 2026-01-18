import { CronService } from "./cron/cron-service";
import { CheckService } from "../domain/user-cases/checks/check-service";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.imp";
import { FileSystemDatasource } from "../infrastructure/datasources/File-system.datasource";

const fileSystemLogRepository = new LogRepositoryImpl(new FileSystemDatasource());

export class Server {
  public static start() {
    console.log("Server started...");

    CronService.createJob("*/5 * * * * *", () => {
      const url = "https://google.com";
      new CheckService(
        fileSystemLogRepository,
        () => console.log(`${url} is ok`),
        (error) => console.log(error),
      ).execute(url);
    });
  }
}
