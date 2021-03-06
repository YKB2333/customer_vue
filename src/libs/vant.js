// 导入自己需要的组件
import {
  Grid, GridItem, Sidebar, SidebarItem, Tab, Tabs, Dialog,
  List, Swipe, SwipeItem, NavBar, Tag, Button, Search,
  Popup, Field, Checkbox, CheckboxGroup, DropdownMenu,
  DropdownItem, CellGroup, Cell, Icon, Card, Stepper, Image, ActionSheet,
  DatetimePicker, Tabbar, TabbarItem, Row, Col, PullRefresh, IndexBar, IndexAnchor, Loading,
  Sticky, Step, Steps, Progress, Picker, Calendar, Empty, Uploader, NoticeBar
} from 'vant';
// 桌面端
import '@vant/touch-emulator';

const VANT = {
  install: function (Vue) {
    Vue.use(Grid).use(GridItem)
    Vue.use(Sidebar).use(SidebarItem)
    Vue.use(Tab).use(Tabs)
    Vue.use(List)
    Vue.use(Swipe).use(SwipeItem)
    Vue.use(NavBar)
    Vue.use(Tag)
    Vue.use(Button)
    Vue.use(Image)
    Vue.use(Search).use(Popup).use(Field).use(Checkbox).use(CheckboxGroup).use(DropdownMenu)
    Vue.use(DropdownItem).use(CellGroup).use(Cell)
    Vue.use(Icon).use(Card).use(Stepper)
    Vue.use(ActionSheet).use(DatetimePicker)
    Vue.use(Tabbar).use(TabbarItem)
    Vue.use(Row).use(Col)
    Vue.use(PullRefresh)
    Vue.use(IndexBar).use(IndexAnchor)
    Vue.use(Loading)
    Vue.use(Dialog)
    Vue.use(Sticky)
    Vue.use(Progress)
    Vue.use(Step).use(Steps)
    Vue.use(Picker)
    Vue.use(Calendar)
    Vue.use(Empty)
    Vue.use(Uploader)
    Vue.use(NoticeBar);
  }
}

export default VANT;