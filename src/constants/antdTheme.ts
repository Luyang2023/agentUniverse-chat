import { ConfigProviderProps, theme } from 'antd';

// dark主题
export const darkTheme: ConfigProviderProps['theme'] = {
  algorithm: theme?.darkAlgorithm, // 外部如果依赖 antd4，就没有theme
  token: {
    colorTextPlaceholder: '#b1b1b1',
    colorBgBase: '#141414',
    colorBorder: 'rgba(255, 255, 255, 0.15)'
  },
  components: {
    Button: {
      defaultGhostBorderColor: '#424242',
      defaultGhostColor: 'rgba(255, 255, 255, 0.85)',
      textHoverBg: '#3c89e8',
      defaultBg: '#1f1f1f',
      colorText: '#b1b1b1',
    },
    Message: {
      contentBg: '#1f1f1f',
      colorText: '#b1b1b1',
    },
    Modal: {
      colorBgElevated: '#1f1f1f',
      titleColor: '#dedede',
    },
    Input: {
      colorBorder: '#424242',
      colorBgContainerDisabled: '#1f1f1f',
      colorTextPlaceholder: '#3c3c3c',
      fontSize: 14,
    },
    Drawer: {
      colorIcon: '#848484',
      colorIconHover: '#fff',
      colorBgElevated: '#1f1f1f',
    },
  },
};

// light主题
export const lightTheme: ConfigProviderProps['theme'] = {
  algorithm: theme.defaultAlgorithm,
}
