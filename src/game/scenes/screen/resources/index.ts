import { ScreenAudio } from '../types';

import audioError from './audio/error.mp3';

import { Assets } from '~lib/assets';

Assets.AddAudio(ScreenAudio.ERROR, audioError);
