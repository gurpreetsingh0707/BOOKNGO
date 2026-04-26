const cron = require('node-cron');
const { syncMoviesToDB } = require('./movieService');
const { syncFakeData } = require('./fakeDataService');

const startCronJobs = () => {
  // Daily midnight update (0 0 = 12:00 AM)
  cron.schedule('0 0 * * *', async () => {
    console.log('🔄 Running scheduled sync at midnight...');
    try {
      await syncMoviesToDB();
      await syncFakeData();
      console.log('✅ Sync completed successfully');
    } catch (error) {
      console.error('❌ Sync error:', error.message);
    }
  });

  console.log('✅ Cron jobs started');
};

module.exports = { startCronJobs };