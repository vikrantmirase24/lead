import { _mock } from './_mock';

// ----------------------------------------------------------------------



export const _notifications = [...Array(1)].map((_, index) => ({
  id: _mock.id(index),
  avatarUrl: [
    null,
  ][index],
  type: ['mail'][
    index
  ],
  category: [
    'Communication',
  ][index],
  isUnRead: _mock.boolean(index),
  createdAt: _mock.time(index),
  title:
   (index === 0 && `<p>Your order is placed waiting for shipping</p>`) ||
   '',
}));

// ----------------------------------------------------------------------




