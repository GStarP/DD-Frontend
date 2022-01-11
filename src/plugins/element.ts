import { App } from "vue";
import { ElButton } from 'element-plus'

const useElementPlus = (app: App) => {
  app.use(ElButton)
}

export default useElementPlus