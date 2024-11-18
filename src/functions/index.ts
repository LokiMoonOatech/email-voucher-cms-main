import addOrUpdateChannelAuth from './addOrUpdateChannelAuth';
import addOrUpdateParsers from './addOrUpdateParsers';
import addOrUpdatePropertyChannelMapping from './addOrUpdatePropertyChannelMapping';
import addOrUpdateRatePlanMapping from './addOrUpdateRatePlanMapping';
import addOrUpdateVendor from './addOrUpdateVendor';
import getChannels from './getChannels';
import getPropertyChannelMappings from './getPropertyChannelMappings';
import getPropertyEvcmsEnableStatuses from './getPropertyEvcmsEnableStatuses';
import getPropertyRatePlanMappings from './getPropertyRatePlanMappings';
import getRegisteredPropertyEmail from './getRegisteredPropertyEmail';
import getVendors from './getVendors';
import processEmailNotification from './processEmailNotification';
import registerChannelEmail from './registerChannelEmail';
import registerPropertyEmail from './registerPropertyEmail';
import handleSlackAction from './slack';
import watchLabels from './watchLabels';

export default {
  addOrUpdateVendor,
  watchLabels,
  processEmailNotification,
  addOrUpdateParsers,
  addOrUpdateChannelAuth,
  addOrUpdatePropertyChannelMapping,
  registerChannelEmail,
  registerPropertyEmail,
  addOrUpdateRatePlanMapping,
  getPropertyEvcmsEnableStatuses,
  getRegisteredPropertyEmail,
  getPropertyRatePlanMappings,
  getPropertyChannelMappings,
  getVendors,
  getChannels,
  handleSlackAction,
};
