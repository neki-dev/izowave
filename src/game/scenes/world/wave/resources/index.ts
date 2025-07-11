import { WaveAudio } from '../types';

import audioComplete from './audio/complete.mp3';
import audioStart from './audio/start.mp3';
import audioTick from './audio/tick.mp3';

import { Assets } from '~lib/assets';

Assets.AddAudio(WaveAudio.START, audioStart);
Assets.AddAudio(WaveAudio.COMPLETE, audioComplete);
Assets.AddAudio(WaveAudio.TICK, audioTick);
