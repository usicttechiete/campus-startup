// Load environment variables FIRST before any other imports
import './config-env.js';

import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});
