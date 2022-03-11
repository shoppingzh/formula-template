## 下载与使用

```bash
yarn add formula-template
# npm i formula-template
```

```js
import config from 'formula-template/dist/config.json'
import groupsSpriteImage from 'formula-template/dist/groups.png'
import symbolsSpriteImage from 'formula-template/dist/symbols.png'
```


## 配置

**Config**

属性 | 说明 | 类型 | 可选值
-- | -- | -- | --
groups | 模板组 | Array\<Group\> | -
symbols | 符号组 | Array\<Group\> | -

**SpriteImage**

属性 | 说明 | 类型 | 可选值
-- | -- | -- | --
position | 位置 | Object | -
position.x | x坐标 | Number | -
position.y | y坐标 | Number | -
position.width | 宽度 | Number | -
position.height | 高度 | Number | -

**Group**

属性 | 说明 | 类型 | 可选值
-- | -- | -- | --
name | 组名 | String | -
label | 组中文名 | String | -
image | 图片 | SpriteImage | -
elements | 模板元素集合 | Array\<Element\> | -

**Element**

属性 | 说明 | 类型 | 可选值
-- | -- | -- | --
image | 图片 | SpriteImage | -
exp | 表达式 | String | -
