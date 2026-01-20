import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, SeverityLevel } from "../../generated/prisma/client";

import { envs } from "../../config/plugins/envs.plugin";
import { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

const connectionString = envs.POSTGRES_URL;
const adapter = new PrismaPg({ connectionString });
const prismaClient = new PrismaClient({ adapter });

const severityEnum = {
  low: SeverityLevel.LOW,
  medium: SeverityLevel.MEDIUM,
  high: SeverityLevel.HIGH,
};

export class PostgresLogDatasource implements LogDatasource {
  async saveLog(log: LogEntity): Promise<void> {
    const level = severityEnum[log.level];

    const newLog = await prismaClient.logModel.create({
      data: {
        ...log,
        level: level,
      },
    });

    // console.log('Posgres saved');
  }

  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const level = severityEnum[severityLevel];

    const dbLogs = await prismaClient.logModel.findMany({
      where: { level },
    });

    return dbLogs.map(LogEntity.fromObject);
  }
}
