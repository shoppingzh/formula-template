**Group**

属性 | 说明 | 类型 | 可选值
-- | -- | -- | --
name | 组名 | String | -
label | 组中文名 | String | -
image | 图片 | Image | -
elements | 模板元素集合 | Array\<Element\> | -

**Image**

属性 | 说明 | 类型 | 可选值
-- | -- | -- | --
__path | 图片的路径（内部属性） | String | -
position | 位置 | Object | -
position.x | x坐标 | Number | -
position.y | y坐标 | Number | -
position.width | 宽度 | Number | -
position.height | 高度 | Number | -

**Element**

属性 | 说明 | 类型 | 可选值
-- | -- | -- | --
image | 图片 | Image | -
exp | 表达式 | String | -
