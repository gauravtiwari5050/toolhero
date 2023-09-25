import { Run } from '../shared/utils/Run';

(async () => {
  const cli = new Run();
  let exitCode = 0;
  try {
    await cli.run();
  } catch (err) {
    console.error(err);
    exitCode = -1;
  }
  process.exit(exitCode);
})();
