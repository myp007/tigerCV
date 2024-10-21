/**
 * @author:cloud.lg
 * @date:2022.9.2
 * @description: 公用数据
 */
 const commonData = {
  Language_level: [
    { name: 'Poor (Use with translation tools)', id: 1 },
    { name: 'Basic (Simple text communication)', id: 2 },
    { name: 'Medium (Daily use)', id: 3 },
    { name: 'Good (Good expression and comprehension skills)', id: 4 },
    { name: 'Excellent (Precise grammar and vocabulary)', id: 5 }
  ],
  skill_level: [
    { name: 'Interest (Interested or self-taught)', id: 1 },
    { name: 'Learned (With systematic training)', id: 2 },
    { name: 'Basic (Occasionally used)', id: 3 },
    { name: 'Skilled (Frequently used)', id: 4 },
    { name: 'Expert (Advanced usage and problem solving)', id: 5 }
  ],
/**
   * @memberof 根据id查询不同类型的名称 
   * @param {id} id
   * @param {type} commonData中的键
   * @param {array} array 数组 null 字符   
   */
  getCommonTypeName: (id, type, array) => {
      let lsit = commonData[type]
      if (type == 'warehouseType' && id == 0) {
          return '-'
      }
      if (!id && id != 0) {
          return '-'
      }
      if (array == 'array') {
          let ids = id.split(',')
          let names = []
          ids.forEach(item => {
              for (var i=0; i<lsit.length; i++) {
                  if (lsit[i].id == item) {
                      names.push(lsit[i].name)
                  }
              }
          });
          return names.join(',')
      } else {
          for (var i=0; i<lsit.length; i++) {
              if (lsit[i].id == id) {
                  return lsit[i].name
              }
          }
      }
  },
}

export default commonData
