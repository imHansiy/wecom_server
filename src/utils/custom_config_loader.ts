import { ConfigFactory } from '@nestjs/config';
import * as fs from 'fs';

const setNestedValue = (obj: Record<string, any>, keys: string[], value: any): void => {
  const key = keys.shift();
  if (!key) return;

  if (!keys.length) {
    obj[key] = value;
  } else {
    obj[key] = obj[key] || {};
    setNestedValue(obj[key], keys, value);
  }
};

const mergeDeep = (target: Record<string, any>, source: Record<string, any>): Record<string, any> => {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], mergeDeep(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
};

/**
 * Custom configuration loader that merges environment variables and JSON configuration files.
 * Environment variables take precedence and are deeply merged with the JSON configuration.
 */
export const customConfigLoader: ConfigFactory = (): Record<string, any> => {
  const config: Record<string, any> = {};

  for (const envKey in process.env) {
    const lowerKey = envKey.toLowerCase();
    const keys = lowerKey.split('__');
    if (keys.length > 1) {
      setNestedValue(config, keys, process.env[envKey]);
    } else {
      config[lowerKey] = process.env[envKey];
    }
  }

  const jsonFilePath = `config.${process.env.NODE_ENV || 'development'}.json`;
  if (fs.existsSync(jsonFilePath)) {
    const jsonFileContent = fs.readFileSync(jsonFilePath, 'utf-8');

    // 检查文件内容是否为空
    if (jsonFileContent.trim()) {
      try {
        const parsed = JSON.parse(jsonFileContent);
        mergeDeep(config, parsed);
      } catch (error) {
        console.error('Failed to parse JSON configuration file:', error);
        throw error; // 重新抛出错误以确保问题能够被适当处理
      }
    } else {
      console.warn(`Configuration file ${jsonFilePath} is empty. Skipping JSON parsing.`);
    }
  } else {
    console.warn(`Configuration file ${jsonFilePath} does not exist. Skipping JSON parsing.`);
  }
  return config;
};
