export const visibility = () => ({
  staticUtilities: {
    show: {
      properties: [['display', 'initial']],
    },
    hide: {
      properties: [['display', 'none']],
    },
    visible: {
      properties: [['visibility', 'visible']],
    },
    invisible: {
      properties: [['visibility', 'hidden']],
    },
    srOnly: {
      properties: [
        ['position', 'absolute'],
        ['width', '1px'],
        ['height', '1px'],
        ['padding', '0'],
        ['margin', '-1px'],
        ['overflow', 'hidden'],
        ['clip', 'rect(0, 0, 0, 0)'],
        ['white-space', 'nowrap'],
        ['border-width', '0'],
      ],
    },
  },
});
