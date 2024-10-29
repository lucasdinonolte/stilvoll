import { TContext } from '../types';

const isFlag = (str: string) => str.startsWith('--') || str.startsWith('-');

export const parseCLIFlags = <T extends string>(
  flags: Record<T, Array<string>>,
  args: Array<string>,
): Record<T, boolean> => {
  const res = Object.keys(flags).reduce((acc, cur) => {
    acc[cur] = false;
    return acc;
  }, {});

  args.filter(isFlag).forEach((cur) => {
    const key = Object.keys(flags).find((k) => flags[k]?.includes(cur));
    if (!!key) {
      res[key] = true;
    }
  });

  return res as Record<T, boolean>;
};

export const getCLICommand =
  <T extends string>(
    commands: Record<T, (args: Array<string>, context: TContext) => void>,
    opts: {
      defaultCommand?: T;
    } = {},
  ) =>
  ({ args, context }: { args: Array<string>; context: TContext }) => {
    const command = args[0] as T | undefined;

    if (command === undefined || isFlag(command)) {
      if (opts.defaultCommand !== undefined) {
        context.logger.debug(
          `No command provided, using default (${opts.defaultCommand})`,
        );
        commands[opts.defaultCommand](args, context);
      } else {
        context.logger.error('No command provided');
      }
      return;
    }

    const commandExists = Object.keys(commands).includes(command);

    if (!commandExists) {
      context.logger.error(`Command "${command}" does not exist`);
      return;
    }

    context.logger.debug(`Running command "${command}"`);
    commands[command](args.slice(1), context);
  };
