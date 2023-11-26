import {LanguageCode} from '../hooks/TalkingInterface';

export const MAX_DAILY_QUESTIONS = 200;

export const optionsLenguage = [
  {
    label: 'Español',
    value: '0',
    testID: LanguageCode.ES,
    accessibilityLabel: LanguageCode.ES,
  },
  {
    label: 'Inglés',
    value: '1',
    testID: LanguageCode.EN,
    accessibilityLabel: LanguageCode.EN,
  },
];
