import { defineStore } from 'pinia'

export interface WeatherData {
  now: {
    tmp: string | number;
    cond_code: string | number;
    cond_txt: string;
    wind_dir?: string;
    wind_sc?: string;
    hum?: string;
  };
  location: string;
  daily_forecast?: Array<{
    date: string;
    tmp_max: string | number;
    tmp_min: string | number;
    cond_code_d: string | number;
  }>;
  air_now_city?: {
    qlty: string;
    aqi: string;
  };
  hourly?: Array<{
    time: string;
    tmp: string | number;
    cond_code: string | number;
  }>;
  sun?: {
    rise: string;
    set: string;
  };
}

export const useSettingStore = defineStore('setting', {
  state: () => ({
    setContent: {
      bgBlur: 0,
      sunrise: false,
      themeMode: 'light',
      showWeather: true,
      yiyan: true,
      iconSize: 45,
      iconOpacity: 80,
      iconRadius: 20,
      startAnimation: true,
    },
    wallpaper: {
      src: '',
      type: 0,
      title: '',
      copyright: '',
      local: '',
    },
    moment: 'd', // 'd' for day, 'n' for night
    showSide: false,
    sideComp: '',
    weatherData: {
      now: {
        tmp: '0',
        cond_code: 100,
        cond_txt: '',
      },
      location: '',
    } as WeatherData,
    navList: [] as any[][],
    navRowData: {} as any,
    editType: 'add' as 'add' | 'edit',
    initialIndex: 0,
    hideAppGroup: false,
  }),
  actions: {
    setNavList(list: any[][]) {
      this.navList = list
    },
    setNavRowData(data: any) {
      this.navRowData = data
    },
    setEditType(type: 'add' | 'edit') {
      this.editType = type
    },
    setHideAppGroup(val: boolean) {
      this.hideAppGroup = val
    },
    setInitialIndex(index: number) {
      this.initialIndex = index
    },
    setWallpaper(wallpaper: any) {
      this.wallpaper = wallpaper
    },
    setThemeMode(mode: string) {
      this.setContent.themeMode = mode
    },
    setShowSide(payload: { val: boolean, comp?: string }) {
      this.showSide = payload.val
      if (payload.comp) {
        this.sideComp = payload.comp
      }
    },
    setWeather(data: any) {
      this.weatherData = data
    },
    setMoment(moment: 'd' | 'n') {
      this.moment = moment
    },
    setSetContent(content: any) {
      this.setContent = { ...this.setContent, ...content }
    },
  },
  persist: true,
})
