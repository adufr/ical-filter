export default defineAppConfig({
  ui: {
    colors: {
      primary: 'purple',
      neutral: 'slate',
    },
    modal: {
      variants: {
        fullscreen: {
          true: {
            content:
              'top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:max-w-7xl sm:h-full sm:max-h-[calc(100vh-10rem)] sm:rounded-[calc(var(--ui-radius)*2)] sm:shadow-lg sm:ring ring-[var(--ui-border)]',
          },
        },
      },
    },
  },
})
