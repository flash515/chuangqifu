// pages/manage/sortedit.js
const app = getApp()

const ProductSortArray = [{
    "Category1Code": "01",
    "Category1Name": "地址服务",
    "Category2Array": [{
        "Category2Code": "01",
        "Category2Name": "地址挂靠",
        "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "深圳挂靠",
        }, ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "商秘地址",
        "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "深圳商秘",
        }, ]
      },

    ]
  },
  {
    "Category1Code": "02",
    "Category1Name": "工商代办",
    "Category2Array": [{
        "Category2Code": "01",
        "Category2Name": "工商注册",
        "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "深圳注册",
        }, ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "工商变更",
        "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "深圳变更",
        }, ]
      },
      {
        "Category2Code": "03",
        "Category2Name": "工商注销",
        "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "深圳注销",
        }, ]
      }
    ]
  },
  {
    "Category1Code": "03",
    "Category1Name": "财税服务",
    "Category2Array": [{
        "Category2Code": "01",
        "Category2Name": "记账报税",
        "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "深圳记账报税",
        }, ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "税票代办",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "自然人代办",
          },
          {
            "Category3Code": "02",
            "Category3Name": "企业代办",
          },
        ]
      },
    ]
  },
  {
    "Category1Code": "04",
    "Category1Name": "企业托管",
    "Category2Array": [{
        "Category2Code": "01",
        "Category2Name": "个体户托管",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "江西托管",
          },
          {
            "Category3Code": "02",
            "Category3Name": "陕西托管",
          },
          {
            "Category3Code": "03",
            "Category3Name": "云南托管",
          },
          {
            "Category3Code": "04",
            "Category3Name": "河南托管",
          },
        ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "公司托管",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "上海托管",
          },
          {
            "Category3Code": "02",
            "Category3Name": "安徽托管",
          },

          {
            "Category3Code": "03",
            "Category3Name": "浙江托管",
          },
        ]
      },
    ]
  },
  {
    "Category1Code": "05",
    "Category1Name": "资质代办",
    "Category2Array": [{
        "Category2Code": "01",
        "Category2Name": "食品经营许可证",
        "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "深圳食品经营",
        }, ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "道路运输许可证",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "上海道路运输",
          },
          {
            "Category3Code": "02",
            "Category3Name": "安徽道路运输",
          },
        ]
      },
      {
        "Category2Code": "03",
        "Category2Name": "医疗器械许可证",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "上海医疗器械",
          },
          {
            "Category3Code": "02",
            "Category3Name": "安徽医疗器械",
          },
          {
            "Category3Code": "03",
            "Category3Name": "浙江医疗器械",
          },
        ]
      },
    ]
  },
];
const BusinessSortArray = [{
    "Category1Code": "C",
    "Category1Name": "制造业",
    "Category2Array": [{
        "Category2Code": "13",
        "Category2Name": "农副食品加工业",
        "Category3Array": [{
            "Category3Code": "131",
            "Category3Name": "谷物磨制",
          },
          {
            "Category3Code": "132",
            "Category3Name": "饲料加工",
          },
          {
            "Category3Code": "133",
            "Category3Name": "植物油加工",
          },
          {
            "Category3Code": "134",
            "Category3Name": "制糖业",
          },
          {
            "Category3Code": "135",
            "Category3Name": "屠宰及肉类加工",
          },
          {
            "Category3Code": "136",
            "Category3Name": "水产品加工",
          },
          {
            "Category3Code": "137",
            "Category3Name": "蔬菜、菌类、水果和坚果加工",
          },
          {
            "Category3Code": "139",
            "Category3Name": "其他农副食品加工",
          },
        ]
      },
      {
        "Category2Code": "14",
        "Category2Name": "食品制造业",
        "Category3Array": [{
            "Category3Code": "141",
            "Category3Name": "焙烤食品制造",
          },
          {
            "Category3Code": "142",
            "Category3Name": "糖果、巧克力及蜜饯制造",
          },
          {
            "Category3Code": "143",
            "Category3Name": "方便食品制造",
          },
          {
            "Category3Code": "144",
            "Category3Name": "乳制品制造",
          },
          {
            "Category3Code": "145",
            "Category3Name": "罐头食品制造",
          },
          {
            "Category3Code": "146",
            "Category3Name": "调味品、发酵制品制造",
          },
          {
            "Category3Code": "149",
            "Category3Name": "其他食品制造",
          },
        ]
      },
      {
        "Category2Code": "15",
        "Category2Name": "酒、饮料和精制茶制造业",
        "Category3Array": [{
            "Category3Code": "151",
            "Category3Name": "酒的制造",
          },
          {
            "Category3Code": "152",
            "Category3Name": "饮料制造",
          },
          {
            "Category3Code": "153",
            "Category3Name": "精制茶加工",
          },
        ]
      },
      {
        "Category2Code": "16",
        "Category2Name": "烟草制品业",
        "Category3Array": [{
            "Category3Code": "161",
            "Category3Name": "烟叶复烤",
          },
          {
            "Category3Code": "162",
            "Category3Name": "卷烟制造",
          },
          {
            "Category3Code": "163",
            "Category3Name": "其他烟草制品制造",
          },
        ]
      },
      {
        "Category2Code": "17",
        "Category2Name": "纺织业",
        "Category3Array": [{
            "Category3Code": "171",
            "Category3Name": "棉纺织及印染精加工",
          },
          {
            "Category3Code": "172",
            "Category3Name": "毛纺织及染整精加工",
          },
          {
            "Category3Code": "173",
            "Category3Name": "麻纺织及染整精加工",
          },
          {
            "Category3Code": "174",
            "Category3Name": "丝绢纺织及印染精加工",
          },
          {
            "Category3Code": "175",
            "Category3Name": "化纤织造及印染精加工",
          },
          {
            "Category3Code": "176",
            "Category3Name": "针织或钩针编织物及其制品制造",
          },
          {
            "Category3Code": "177",
            "Category3Name": "家用纺织制成品制造",
          },
          {
            "Category3Code": "178",
            "Category3Name": "产业用纺织制成品制造",
          },
        ]
      },
      {
        "Category2Code": "18",
        "Category2Name": "纺织服装、服饰业",
        "Category3Array": [{
            "Category3Code": "181",
            "Category3Name": "机织服装制造",
          },
          {
            "Category3Code": "182",
            "Category3Name": "针织或钩针编织服装制造",
          },
          {
            "Category3Code": "183",
            "Category3Name": "服饰制造",
          },
        ]
      },
      {
        "Category2Code": "19",
        "Category2Name": "皮革、毛皮、羽毛及其制品和制鞋业",
        "Category3Array": [{
            "Category3Code": "191",
            "Category3Name": "皮革鞣制加工",
          },
          {
            "Category3Code": "192",
            "Category3Name": "皮革制品制造",
          },
          {
            "Category3Code": "193",
            "Category3Name": "毛皮鞣制及制品加工",
          },
          {
            "Category3Code": "194",
            "Category3Name": "羽毛（绒）加工及制品制造",
          },
          {
            "Category3Code": "195",
            "Category3Name": "制鞋业",
          },
        ]
      },
      {
        "Category2Code": "20",
        "Category2Name": "木材加工和木、竹、藤、棕、草制品业",
        "Category3Array": [{
            "Category3Code": "201",
            "Category3Name": "木材加工",
          },
          {
            "Category3Code": "202",
            "Category3Name": "人造板制造",
          },
          {
            "Category3Code": "203",
            "Category3Name": "木质制品制造",
          },
          {
            "Category3Code": "204",
            "Category3Name": "竹、藤、棕、草等制品制造",
          },
        ]
      },
      {
        "Category2Code": "21",
        "Category2Name": "家具制造业",
        "Category3Array": [{
            "Category3Code": "211",
            "Category3Name": "木质家具制造",
          },
          {
            "Category3Code": "212",
            "Category3Name": "竹、藤家具制造",
          },
          {
            "Category3Code": "213",
            "Category3Name": "金属家具制造",
          },
          {
            "Category3Code": "214",
            "Category3Name": "塑料家具制造",
          },
          {
            "Category3Code": "219",
            "Category3Name": "其他家具制造",
          },
        ]
      },
      {
        "Category2Code": "22",
        "Category2Name": "造纸和纸制品业",
        "Category3Array": [{
            "Category3Code": "221",
            "Category3Name": "纸浆制造",
          },
          {
            "Category3Code": "222",
            "Category3Name": "造纸",
          },
          {
            "Category3Code": "223",
            "Category3Name": "纸制品制造",
          },
        ]
      },
      {
        "Category2Code": "23",
        "Category2Name": "印刷和记录媒介复制业",
        "Category3Array": [{
            "Category3Code": "231",
            "Category3Name": "印刷",
          },
          {
            "Category3Code": "232",
            "Category3Name": "装订及印刷相关服务",
          },
          {
            "Category3Code": "233",
            "Category3Name": "记录媒介复制",
          },
        ]
      },
      {
        "Category2Code": "24",
        "Category2Name": "文教、工美、体育和娱乐用品制造业",
        "Category3Array": [{
            "Category3Code": "241",
            "Category3Name": "文教办公用品制造",
          },
          {
            "Category3Code": "242",
            "Category3Name": "乐器制造",
          },
          {
            "Category3Code": "243",
            "Category3Name": "工艺美术及礼仪用品制造",
          },
          {
            "Category3Code": "244",
            "Category3Name": "体育用品制造",
          },
          {
            "Category3Code": "245",
            "Category3Name": "玩具制造",
          },
          {
            "Category3Code": "246",
            "Category3Name": "游艺器材及娱乐用品制造",
          },
        ]
      },
      {
        "Category2Code": "25",
        "Category2Name": "石油、煤炭及其他燃料加工业",
        "Category3Array": [{
            "Category3Code": "251",
            "Category3Name": "精炼石油产品制造",
          },
          {
            "Category3Code": "252",
            "Category3Name": "煤炭加工",
          },
          {
            "Category3Code": "254",
            "Category3Name": "生物质燃料加工",
          },
        ]
      },
      {
        "Category2Code": "26",
        "Category2Name": "化学原料和化学制品制造业",
        "Category3Array": [{
            "Category3Code": "261",
            "Category3Name": "基础化学原料制造",
          },
          {
            "Category3Code": "262",
            "Category3Name": "肥料制造",
          },
          {
            "Category3Code": "263",
            "Category3Name": "农药制造",
          },
          {
            "Category3Code": "264",
            "Category3Name": "涂料、油墨、颜料及类似产品制造",
          },
          {
            "Category3Code": "265",
            "Category3Name": "合成材料制造",
          },
          {
            "Category3Code": "266",
            "Category3Name": "专用化学产品制造",
          },
          {
            "Category3Code": "267",
            "Category3Name": "炸药、火工及焰火产品制造",
          },
          {
            "Category3Code": "268",
            "Category3Name": "日用化学产品制造",
          },
        ]
      },
      {
        "Category2Code": "27",
        "Category2Name": "医药制造业",
        "Category3Array": [{
            "Category3Code": "271",
            "Category3Name": "化学药品原料药制造",
          },
          {
            "Category3Code": "272",
            "Category3Name": "化学药品制剂制造",
          },
          {
            "Category3Code": "273",
            "Category3Name": "中药饮片加工",
          },
          {
            "Category3Code": "274",
            "Category3Name": "中成药生产",
          },
          {
            "Category3Code": "275",
            "Category3Name": "兽用药品制造",
          },
          {
            "Category3Code": "276",
            "Category3Name": "生物药品制品制造",
          },
          {
            "Category3Code": "277",
            "Category3Name": "卫生材料及医药用品制造",
          },
          {
            "Category3Code": "278",
            "Category3Name": "药用辅料及包装材料",
          },
        ]
      },
      {
        "Category2Code": "28",
        "Category2Name": "化学纤维制造业",
        "Category3Array": [{
            "Category3Code": "281",
            "Category3Name": "纤维素纤维原料及纤维制造",
          },
          {
            "Category3Code": "282",
            "Category3Name": "合成纤维制造",
          },
          {
            "Category3Code": "283",
            "Category3Name": "生物基材料制造",
          },
        ]
      },
      {
        "Category2Code": "29",
        "Category2Name": "橡胶和塑料制品业",
        "Category3Array": [{
            "Category3Code": "291",
            "Category3Name": "橡胶制品业",
          },
          {
            "Category3Code": "292",
            "Category3Name": "塑料制品业",
          },
        ]
      },
      {
        "Category2Code": "30",
        "Category2Name": "非金属矿物制品业业",
        "Category3Array": [{
            "Category3Code": "301",
            "Category3Name": "水泥、石灰和石膏制造",
          },
          {
            "Category3Code": "302",
            "Category3Name": "石膏、水泥制品及类似制品制造",
          },
          {
            "Category3Code": "303",
            "Category3Name": "砖瓦、石材等建筑材料制造",
          },
          {
            "Category3Code": "304",
            "Category3Name": "玻璃制造",
          },
          {
            "Category3Code": "305",
            "Category3Name": "玻璃制品制造",
          },
          {
            "Category3Code": "306",
            "Category3Name": "玻璃纤维和玻璃纤维增强塑料制品制造",
          },
          {
            "Category3Code": "307",
            "Category3Name": "陶瓷制品制造",
          },
          {
            "Category3Code": "308",
            "Category3Name": "塑耐火材料制品制造",
          },
          {
            "Category3Code": "309",
            "Category3Name": "石墨及其他非金属矿物制品制造",
          },

        ]
      },
      {
        "Category2Code": "31",
        "Category2Name": "黑色金属冶炼和压延加工业",
        "Category3Array": [{
            "Category3Code": "311",
            "Category3Name": "炼铁",
          },
          {
            "Category3Code": "312",
            "Category3Name": "炼钢",
          },
          {
            "Category3Code": "313",
            "Category3Name": "钢压延加工",
          },
          {
            "Category3Code": "314",
            "Category3Name": "铁合金冶炼",
          },
        ]
      },
      {
        "Category2Code": "32",
        "Category2Name": "有色金属冶炼和压延加工业",
        "Category3Array": [{
            "Category3Code": "321",
            "Category3Name": "常用有色金属冶炼",
          },
          {
            "Category3Code": "322",
            "Category3Name": "贵金属冶炼",
          },
          {
            "Category3Code": "323",
            "Category3Name": "稀有稀土金属冶炼",
          },
          {
            "Category3Code": "324",
            "Category3Name": "有色金属合金制造",
          },
          {
            "Category3Code": "325",
            "Category3Name": "有色金属压延加工",
          },
        ]
      },
      {
        "Category2Code": "33",
        "Category2Name": "金属制品业",
        "Category3Array": [{
            "Category3Code": "331",
            "Category3Name": "结构性金属制品制造",
          },
          {
            "Category3Code": "332",
            "Category3Name": "金属工具制造",
          },
          {
            "Category3Code": "333",
            "Category3Name": "集装箱及金属包装容器制造",
          },
          {
            "Category3Code": "334",
            "Category3Name": "金属丝绳及其制品制造",
          },
          {
            "Category3Code": "335",
            "Category3Name": "建筑、安全用金属制品制造",
          },
          {
            "Category3Code": "336",
            "Category3Name": "金属表面处理及热处理加工",
          },
          {
            "Category3Code": "337",
            "Category3Name": "搪瓷制品制造",
          },
          {
            "Category3Code": "338",
            "Category3Name": "金属制日用品制造",
          },
          {
            "Category3Code": "339",
            "Category3Name": "铸造及其他金属制品制造",
          },

        ]
      },
      {
        "Category2Code": "34",
        "Category2Name": "通用设备制造业",
        "Category3Array": [{
            "Category3Code": "341",
            "Category3Name": "锅炉及原动设备制造",
          },
          {
            "Category3Code": "342",
            "Category3Name": "金属加工机械制造",
          },
          {
            "Category3Code": "343",
            "Category3Name": "物料搬运设备制造",
          },
          {
            "Category3Code": "344",
            "Category3Name": "泵、阀门、压缩机及类似机械制造",
          },
          {
            "Category3Code": "345",
            "Category3Name": "轴承、齿轮和传动部件制造",
          },
          {
            "Category3Code": "346",
            "Category3Name": "烘炉、风机、包装等设备制造",
          },
          {
            "Category3Code": "347",
            "Category3Name": "文化、办公用机械制造",
          },
          {
            "Category3Code": "348",
            "Category3Name": "通用零部件制造",
          },
          {
            "Category3Code": "349",
            "Category3Name": "其他通用设备制造业",
          },

        ]
      },
      {
        "Category2Code": "35",
        "Category2Name": "专用设备制造业",
        "Category3Array": [{
            "Category3Code": "351",
            "Category3Name": "采矿、冶金、建筑专用设备制造",
          },
          {
            "Category3Code": "352",
            "Category3Name": "化工、木材、非金属加工专用设备制造",
          },
          {
            "Category3Code": "353",
            "Category3Name": "食品、饮料、烟草及饲料生产专用设备制造",
          },
          {
            "Category3Code": "354",
            "Category3Name": "印刷、制药、日化及日用品生产专用设备制造",
          },
          {
            "Category3Code": "355",
            "Category3Name": "纺织、服装和皮革加工专用设备制造",
          },
          {
            "Category3Code": "356",
            "Category3Name": "电子和电工机械专用设备制造",
          },
          {
            "Category3Code": "357",
            "Category3Name": "农、林、牧、渔专用机械制造",
          },
          {
            "Category3Code": "358",
            "Category3Name": "医疗仪器设备及器械制造",
          },
          {
            "Category3Code": "359",
            "Category3Name": "环保、邮政、社会公共服务及其他专用设备制造",
          },

        ]
      },
      {
        "Category2Code": "36",
        "Category2Name": "汽车制造业",
        "Category3Array": [{
            "Category3Code": "361",
            "Category3Name": "汽车整车制造",
          },
          {
            "Category3Code": "362",
            "Category3Name": "汽车用发动机制造",
          },
          {
            "Category3Code": "363",
            "Category3Name": "改装汽车制造",
          },
          {
            "Category3Code": "364",
            "Category3Name": "低速汽车制造",
          },
          {
            "Category3Code": "365",
            "Category3Name": "电车制造",
          },
          {
            "Category3Code": "366",
            "Category3Name": "汽车车身、挂车制造",
          },
          {
            "Category3Code": "367",
            "Category3Name": "汽车零部件及配件制造",
          },
        ]
      },
      {
        "Category2Code": "37",
        "Category2Name": "铁路、船舶、航空航天和其他运输设备制造业",
        "Category3Array": [{
            "Category3Code": "371",
            "Category3Name": "铁路运输设备制造",
          },
          {
            "Category3Code": "372",
            "Category3Name": "城市轨道交通设备制造",
          },
          {
            "Category3Code": "373",
            "Category3Name": "船舶及相关装置制造",
          },
          {
            "Category3Code": "374",
            "Category3Name": "航空、航天器及设备制造",
          },
          {
            "Category3Code": "375",
            "Category3Name": "摩托车制造",
          },
          {
            "Category3Code": "376",
            "Category3Name": "自行车和残疾人座车制造",
          },
          {
            "Category3Code": "377",
            "Category3Name": "助动车制造",
          },
          {
            "Category3Code": "378",
            "Category3Name": "非公路休闲车及零配件制造",
          },
          {
            "Category3Code": "379",
            "Category3Name": "潜水救捞及其他未列明运输设备制造",
          },
        ]
      },
      {
        "Category2Code": "38",
        "Category2Name": "电气机械和器材制造业",
        "Category3Array": [{
            "Category3Code": "381",
            "Category3Name": "电机制造",
          },
          {
            "Category3Code": "382",
            "Category3Name": "输配电及控制设备制造",
          },
          {
            "Category3Code": "383",
            "Category3Name": "电线、电缆、光缆及电工器材制造",
          },
          {
            "Category3Code": "384",
            "Category3Name": "电池制造",
          },
          {
            "Category3Code": "385",
            "Category3Name": "家用电力器具制造",
          },
          {
            "Category3Code": "386",
            "Category3Name": "非电力家用器具制造",
          },
          {
            "Category3Code": "387",
            "Category3Name": "照明器具制造",
          },
          {
            "Category3Code": "389",
            "Category3Name": "其他电气机械及器材制造",
          },
        ]
      },
      {
        "Category2Code": "39",
        "Category2Name": "计算机、通信和其他电子设备制造业",
        "Category3Array": [{
            "Category3Code": "391",
            "Category3Name": "计算机制造",
          },
          {
            "Category3Code": "392",
            "Category3Name": "通信设备制造",
          },
          {
            "Category3Code": "393",
            "Category3Name": "广播电视设备制造",
          },
          {
            "Category3Code": "394",
            "Category3Name": "雷达及配套设备制造",
          },
          {
            "Category3Code": "395",
            "Category3Name": "非专业视听设备制造",
          },
          {
            "Category3Code": "396",
            "Category3Name": "智能消费设备制造",
          },
          {
            "Category3Code": "397",
            "Category3Name": "电子器件制造",
          },
          {
            "Category3Code": "398",
            "Category3Name": "电子元件及电子专用材料制造",
          },
          {
            "Category3Code": "399",
            "Category3Name": "其他电子设备制造",
          },
        ]
      },
      {
        "Category2Code": "40",
        "Category2Name": "仪器仪表制造业",
        "Category3Array": [{
            "Category3Code": "401",
            "Category3Name": "通用仪器仪表制造",
          },
          {
            "Category3Code": "402",
            "Category3Name": "专用仪器仪表制造",
          },
          {
            "Category3Code": "403",
            "Category3Name": "钟表与计时仪器制造",
          },
          {
            "Category3Code": "404",
            "Category3Name": "光学仪器制造",
          },
          {
            "Category3Code": "405",
            "Category3Name": "衡器制造",
          },
          {
            "Category3Code": "409",
            "Category3Name": "其他仪器仪表制造业",
          },
        ]
      },
      {
        "Category2Code": "41",
        "Category2Name": "其他制造业",
        "Category3Array": [{
            "Category3Code": "411",
            "Category3Name": "日用杂品制造",
          },
          {
            "Category3Code": "419",
            "Category3Name": "其他未列明制造业",
          },
        ]
      },
      {
        "Category2Code": "42",
        "Category2Name": "废弃资源综合利用业",
        "Category3Array": [{
            "Category3Code": "421",
            "Category3Name": "金属废料和碎屑加工处理",
          },
          {
            "Category3Code": "422",
            "Category3Name": "非金属废料和碎屑加工处理",
          },
        ]
      },
      {
        "Category2Code": "43",
        "Category2Name": "金属制品、机械和设备修理业",
        "Category3Array": [{
            "Category3Code": "431",
            "Category3Name": "金属制品修理",
          },
          {
            "Category3Code": "432",
            "Category3Name": "通用设备修理",
          },
          {
            "Category3Code": "433",
            "Category3Name": "专用设备修理",
          },
          {
            "Category3Code": "434",
            "Category3Name": "铁路、船舶、航空航天等运输设备修理",
          },
          {
            "Category3Code": "435",
            "Category3Name": "电气设备修理",
          },
          {
            "Category3Code": "436",
            "Category3Name": "仪器仪表修理",
          },
          {
            "Category3Code": "439",
            "Category3Name": "其他机械和设备修理业",
          },
        ]
      },
    ]
  },

  {
    "Category1Code": "E",
    "Category1Name": "建筑业",
    "Category2Array": [{
        "Category2Code": "47",
        "Category2Name": "房屋建筑业",
        "Category3Array": [{
            "Category3Code": "471",
            "Category3Name": "住宅房屋建筑",
          },
          {
            "Category3Code": "472",
            "Category3Name": "体育场馆建筑",
          },
          {
            "Category3Code": "479",
            "Category3Name": "其他房屋建筑业",
          },
        ]
      },
      {
        "Category2Code": "48",
        "Category2Name": "土木工程建筑业",
        "Category3Array": [{
            "Category3Code": "481",
            "Category3Name": "铁路、道路、隧道和桥梁工程建筑 ",
          },
          {
            "Category3Code": "482",
            "Category3Name": "水利和水运工程建筑",
          },
          {
            "Category3Code": "483",
            "Category3Name": "海洋工程建筑",
          },
          {
            "Category3Code": "484",
            "Category3Name": "工矿工程建筑",
          },
          {
            "Category3Code": "485",
            "Category3Name": "架线和管道工程建筑",
          },
          {
            "Category3Code": "486",
            "Category3Name": "节能环保工程施工",
          },
          {
            "Category3Code": "487",
            "Category3Name": "电力工程施工",
          },
          {
            "Category3Code": "489",
            "Category3Name": "其他土木工程建筑",
          },

        ]
      },
      {
        "Category2Code": "49",
        "Category2Name": "建筑安装业",
        "Category3Array": [{
            "Category3Code": "491",
            "Category3Name": "电气安装",
          },
          {
            "Category3Code": "492",
            "Category3Name": "管道和设备安装",
          },
          {
            "Category3Code": "499",
            "Category3Name": "其他建筑安装业",
          },

        ]
      },
      {
        "Category2Code": "50",
        "Category2Name": "建筑装饰、装修和其他建筑业",
        "Category3Array": [{
            "Category3Code": "501",
            "Category3Name": "建筑装饰和装修业",
          },
          {
            "Category3Code": "502",
            "Category3Name": "建筑物拆除和场地准备活动",
          },
          {
            "Category3Code": "503",
            "Category3Name": "提供施工设备服务",
          },
          {
            "Category3Code": "509",
            "Category3Name": "其他未列明建筑业",
          },

        ]
      }
    ]
  },

  {
    "Category1Code": "F",
    "Category1Name": "批发和零售业",
    "Category2Array": [{
        "Category2Code": "51",
        "Category2Name": "批发业",
        "Category3Array": [{
            "Category3Code": "511",
            "Category3Name": "农、林、牧、渔产品批发",
          },
          {
            "Category3Code": "512",
            "Category3Name": "食品、饮料及烟草制品批发",
          },
          {
            "Category3Code": "513",
            "Category3Name": "纺织、服装及家庭用品批发",
          },
          {
            "Category3Code": "514",
            "Category3Name": "文化、体育用品及器材批发",
          },
          {
            "Category3Code": "515",
            "Category3Name": "医药及医疗器材批发",
          },
          {
            "Category3Code": "516",
            "Category3Name": "矿产品、建材及化工产品批发",
          },
          {
            "Category3Code": "517",
            "Category3Name": "机械设备、五金产品及电子产品批发",
          },
          {
            "Category3Code": "518",
            "Category3Name": "贸易经纪与代理",
          },
          {
            "Category3Code": "519",
            "Category3Name": "其他批发业",
          },

        ]
      },
      {
        "Category2Code": "52",
        "Category2Name": "零售业",
        "Category3Array": [{
            'Category3Code': '521',
            'Category3Name': '综合零售',
          },
          {
            'Category3Code': '522',
            'Category3Name': '食品、饮料及烟草制品专门零售',
          },
          {
            'Category3Code': '523',
            'Category3Name': '纺织、服装及日用品专门零售',
          },
          {
            'Category3Code': '524',
            'Category3Name': '文化、体育用品及器材专门零售',
          },
          {
            'Category3Code': '525',
            'Category3Name': '医药及医疗器材专门零售',
          },
          {
            'Category3Code': '526',
            'Category3Name': '汽车、摩托车、零配件和燃料及其他动力销售',
          },
          {
            'Category3Code': '527',
            'Category3Name': '家用电器及电子产品专门零售',
          },
          {
            'Category3Code': '528',
            'Category3Name': '五金、家具及室内装饰材料专门零售',
          },
          {
            'Category3Code': '529',
            'Category3Name': '货摊、无店铺及其他零售业',
          },

        ]
      },
    ]
  },

  {
    "Category1Code": "G",
    "Category1Name": "交通运输、仓储和邮政业",
    "Category2Array": [{
        "Category2Code": "54",
        "Category2Name": "道路运输业",
        "Category3Array": [{
            'Category3Code': '541',
            'Category3Name': '城市公共交通运输',
          },
          {
            'Category3Code': '542',
            'Category3Name': '公路旅客运输',
          },
          {
            'Category3Code': '543',
            'Category3Name': '道路货物运输',
          },
          {
            'Category3Code': '544',
            'Category3Name': '道路运输辅助活动',
          },

        ]
      },
      {
        "Category2Code": "55",
        "Category2Name": "水上运输业",
        "Category3Array": [{
            'Category3Code': '551',
            'Category3Name': '水上旅客运输',
          },
          {
            'Category3Code': '552',
            'Category3Name': '水上货物运输',
          },
          {
            'Category3Code': '553',
            'Category3Name': '水上运输辅助活动',
          },

        ]
      },
      {
        "Category2Code": "56",
        "Category2Name": "航空运输业",
        "Category3Array": [{
            'Category3Code': '561',
            'Category3Name': '航空客货运输',
          },
          {
            'Category3Code': '562',
            'Category3Name': '通用航空服务',
          },
          {
            'Category3Code': '563',
            'Category3Name': '航空运输辅助活动',
          },

        ]
      },
      {
        "Category2Code": "57",
        "Category2Name": "管道运输业",
        "Category3Array": [{
            'Category3Code': '571',
            'Category3Name': '海底管道运输',
          },
          {
            'Category3Code': '572',
            'Category3Name': '陆地管道运输',
          },

        ]
      },
      {
        "Category2Code": "58",
        "Category2Name": "多式联运和运输代理业",
        "Category3Array": [{
            'Category3Code': '581',
            'Category3Name': '多式联运',
          },
          {
            'Category3Code': '582',
            'Category3Name': '运输代理业',
          },

        ]
      },
      {
        "Category2Code": "59",
        "Category2Name": "装卸搬运和仓储业",
        "Category3Array": [{
            'Category3Code': '591',
            'Category3Name': '装卸搬运',
          },
          {
            'Category3Code': '592',
            'Category3Name': '通用仓储',
          },
          {
            'Category3Code': '593',
            'Category3Name': '低温仓储',
          },
          {
            'Category3Code': '594',
            'Category3Name': '危险品仓储',
          },
          {
            'Category3Code': '595',
            'Category3Name': '谷物、棉花等农产品仓储',
          },
          {
            'Category3Code': '596',
            'Category3Name': '中药材仓储',
          },
          {
            'Category3Code': '599',
            'Category3Name': '其他仓储业',
          },

        ]
      },
      {
        "Category2Code": "60",
        "Category2Name": "邮政业",
        "Category3Array": [{
            'Category3Code': '602',
            'Category3Name': '快递服务',
          },
          {
            'Category3Code': '609',
            'Category3Name': '其他寄递服务',
          },

        ]
      },
    ]
  },
  {
    "Category1Code": "H",
    "Category1Name": "住宿和餐饮业",
    "Category2Array": [{
        "Category2Code": "61",
        "Category2Name": "住宿业",
        "Category3Array": [{
            'Category3Code': '611',
            'Category3Name': '旅游饭店',
          },
          {
            'Category3Code': '612',
            'Category3Name': '一般旅馆',
          },
          {
            'Category3Code': '613',
            'Category3Name': '民宿服务',
          },
          {
            'Category3Code': '614',
            'Category3Name': '露营地服务',
          },
          {
            'Category3Code': '619',
            'Category3Name': '其他住宿业',
          },
        ]
      },
      {
        "Category2Code": "62",
        "Category2Name": "餐饮业",
        "Category3Array": [{
            'Category3Code': '621',
            'Category3Name': '正餐服务',
          },
          {
            'Category3Code': '622',
            'Category3Name': '快餐服务',
          },
          {
            'Category3Code': '623',
            'Category3Name': '饮料及冷饮服务',
          },
          {
            'Category3Code': '624',
            'Category3Name': '餐饮配送及外卖送餐服务',
          },
          {
            'Category3Code': '629',
            'Category3Name': '其他餐饮业',
          },

        ]
      },
    ]
  },
  {
    "Category1Code": "I",
    "Category1Name": "信息传输、软件和信息技术服务业",
    "Category2Array": [{
        "Category2Code": "63",
        "Category2Name": "电信、广播电视和卫星传输服务",
        "Category3Array": [{
            'Category3Code': '631',
            'Category3Name': '电信',
          },
          {
            'Category3Code': '632',
            'Category3Name': '广播电视传输服务',
          },
          {
            'Category3Code': '633',
            'Category3Name': '卫星传输服务',
          },
        ]
      },
      {
        "Category2Code": "64",
        "Category2Name": "互联网和相关服务",
        "Category3Array": [{
            'Category3Code': '641',
            'Category3Name': '互联网接入及相关服务',
          },
          {
            'Category3Code': '642',
            'Category3Name': '互联网信息服务',
          },
          {
            'Category3Code': '643',
            'Category3Name': '互联网平台',
          },
          {
            'Category3Code': '644',
            'Category3Name': '互联网安全服务',
          },
          {
            'Category3Code': '645',
            'Category3Name': '互联网数据服务',
          },
          {
            'Category3Code': '649',
            'Category3Name': '其他互联网服务',
          },

        ]
      },
      {
        "Category2Code": "65",
        "Category2Name": "软件和信息技术服务业",
        "Category3Array": [{
            'Category3Code': '651',
            'Category3Name': '软件开发',
          },
          {
            'Category3Code': '652',
            'Category3Name': '集成电路设计',
          },
          {
            'Category3Code': '653',
            'Category3Name': '信息系统集成和物联网技术服务',
          },
          {
            'Category3Code': '654',
            'Category3Name': '运行维护服务',
          },
          {
            'Category3Code': '655',
            'Category3Name': '信息处理和存储支持服务',
          },
          {
            'Category3Code': '656',
            'Category3Name': '信息技术咨询服务',
          },
          {
            'Category3Code': '657',
            'Category3Name': '数字内容服务',
          },
          {
            'Category3Code': '659',
            'Category3Name': '其他信息技术服务业',
          },

        ]
      },
    ]
  },
  {
    "Category1Code": "J",
    "Category1Name": "金融业",
    "Category2Array": [{
        "Category2Code": "66",
        "Category2Name": "货币金融服务",
        "Category3Array": [{
          'Category3Code': '663',
          'Category3Name': '非货币银行服务',
        }, ]
      },
      {
        "Category2Code": "67",
        "Category2Name": "资本市场服务",
        "Category3Array": [{
            'Category3Code': '671',
            'Category3Name': '证券市场服务',
          },
          {
            'Category3Code': '672',
            'Category3Name': '公开募集证券投资基金',
          },
          {
            'Category3Code': '673',
            'Category3Name': '非公开募集证券投资基金',
          },
          {
            'Category3Code': '676',
            'Category3Name': '资本投资服务',
          },
          {
            'Category3Code': '679',
            'Category3Name': '其他资本市场服务',
          },

        ]
      },
      {
        "Category2Code": "68",
        "Category2Name": "保险业",
        "Category3Array": [{
            'Category3Code': '685',
            'Category3Name': '保险中介服务',
          },
          {
            'Category3Code': '689',
            'Category3Name': '其他保险活动',
          },

        ]
      },
      {
        "Category2Code": "69",
        "Category2Name": "其他金融业",
        "Category3Array": [{
            'Category3Code': '691',
            'Category3Name': '金融信托与管理服务',
          },
          {
            'Category3Code': '692',
            'Category3Name': '控股公司服务',
          },
          {
            'Category3Code': '693',
            'Category3Name': '非金融机构支付服务',
          },
          {
            'Category3Code': '694',
            'Category3Name': '金融信息服务',
          },
          {
            'Category3Code': '695',
            'Category3Name': '金融资产管理公司',
          },
          {
            'Category3Code': '699',
            'Category3Name': '其他未列明金融业',
          },

        ]
      },
    ]
  },
  {
    "Category1Code": "K",
    "Category1Name": "房地产业",
    "Category2Array": [{
      "Category2Code": "70",
      "Category2Name": "房地产业",
      "Category3Array": [{
          'Category3Code': '701',
          'Category3Name': '房地产开发经营',
        },
        {
          'Category3Code': '702',
          'Category3Name': '物业管理',
        },
        {
          'Category3Code': '703',
          'Category3Name': '房地产中介服务',
        },
        {
          'Category3Code': '704',
          'Category3Name': '房地产租赁经营',
        },
        {
          'Category3Code': '709',
          'Category3Name': '其他房地产业',
        },
      ]
    }, ]
  },
  {
    "Category1Code": "L",
    "Category1Name": "租赁和商务服务业",
    "Category2Array": [{
        "Category2Code": "71",
        "Category2Name": "租赁业",
        "Category3Array": [{
            'Category3Code': '711',
            'Category3Name': '机械设备经营租赁',
          },
          {
            'Category3Code': '712',
            'Category3Name': '文体设备和用品出租',
          },
          {
            'Category3Code': '713',
            'Category3Name': '  日用品出租',
          },

        ]
      },
      {
        "Category2Code": "72",
        "Category2Name": "商务服务业",
        "Category3Array": [{
            'Category3Code': '721',
            'Category3Name': '组织管理服务',
          },
          {
            'Category3Code': '722',
            'Category3Name': '综合管理服务',
          },
          {
            'Category3Code': '723',
            'Category3Name': '法律服务',
          },
          {
            'Category3Code': '724',
            'Category3Name': '咨询与调查',
          },
          {
            'Category3Code': '725',
            'Category3Name': '广告业',
          },
          {
            'Category3Code': '726',
            'Category3Name': '人力资源服务',
          },
          {
            'Category3Code': '727',
            'Category3Name': '安全保护服务 安全服务',
          },
          {
            'Category3Code': '728',
            'Category3Name': '会议、展览及相关服务',
          },
          {
            'Category3Code': '729',
            'Category3Name': '其他商务服务业',
          },

        ]
      },
    ]
  },

  {
    "Category1Code": "M",
    "Category1Name": "科研和技术服务业",
    "Category2Array": [{
        "Category2Code": "73",
        "Category2Name": "研究和试验发展",
        "Category3Array": [{
            'Category3Code': '731',
            'Category3Name': '自然科学研究和试验发展',
          },
          {
            'Category3Code': '732',
            'Category3Name': '工程和技术研究和试验发展',
          },
          {
            'Category3Code': '733',
            'Category3Name': '农业科学研究和试验发展',
          },
          {
            'Category3Code': '734',
            'Category3Name': '医学研究和试验发展',
          },
          {
            'Category3Code': '735',
            'Category3Name': '社会人文科学研究',
          },
        ]
      },
      {
        "Category2Code": "74",
        "Category2Name": "专业技术服务业",
        "Category3Array": [{
            'Category3Code': '745',
            'Category3Name': '质检技术服务',
          },
          {
            'Category3Code': '746',
            'Category3Name': '环境与生态监测检测服务',
          },
          {
            'Category3Code': '748',
            'Category3Name': '工程技术与设计服务',
          },
          {
            'Category3Code': '749',
            'Category3Name': '工业与专业设计及其他专业技术服务',
          },

        ]
      },
      {
        "Category2Code": "75",
        "Category2Name": "科技推广和应用服务业",
        "Category3Array": [{
            'Category3Code': '751',
            'Category3Name': '技术推广服务',
          },
          {
            'Category3Code': '752',
            'Category3Name': '知识产权服务',
          },
          {
            'Category3Code': '753',
            'Category3Name': '科技中介服务',
          },
          {
            'Category3Code': '754',
            'Category3Name': '创业空间服务',
          },
          {
            'Category3Code': '759',
            'Category3Name': '其他科技推广服务业',
          },

        ]
      },
    ]
  },
  {
    "Category1Code": "O",
    "Category1Name": "居民服务、修理和其他服务业",
    "Category2Array": [{
        "Category2Code": "80",
        "Category2Name": "居民服务业",
        "Category3Array": [{
            'Category3Code': '801',
            'Category3Name': '家庭服务',
          },
          {
            'Category3Code': '802',
            'Category3Name': '托儿所服务',
          },
          {
            'Category3Code': '803',
            'Category3Name': '洗染服务',
          },
          {
            'Category3Code': '804',
            'Category3Name': '理发及美容服务',
          },
          {
            'Category3Code': '805',
            'Category3Name': '洗浴和保健养生服务',
          },
          {
            'Category3Code': '806',
            'Category3Name': '摄影扩印服务',
          },
          {
            'Category3Code': '807',
            'Category3Name': '婚姻服务',
          },
          {
            'Category3Code': '808',
            'Category3Name': '殡葬服务',
          },
          {
            'Category3Code': '809',
            'Category3Name': '其他居民服务业',
          },
        ]
      },
      {
        "Category2Code": "81",
        "Category2Name": "机动车、电子产品和日用产品修理业",
        "Category3Array": [{
            'Category3Code': '811',
            'Category3Name': '汽车、摩托车等修理与维护',
          },
          {
            'Category3Code': '812',
            'Category3Name': '计算机和办公设备维修',
          },
          {
            'Category3Code': '813',
            'Category3Name': '家用电器修理',
          },
          {
            'Category3Code': '819',
            'Category3Name': '其他日用产品修理业',
          },

        ]
      },
      {
        "Category2Code": "82",
        "Category2Name": "其他服务业",
        "Category3Array": [{
            'Category3Code': '821',
            'Category3Name': '清洁服务',
          },
          {
            'Category3Code': '822',
            'Category3Name': '宠物服务',
          },
          {
            'Category3Code': '829',
            'Category3Name': '其他未列明服务业',
          },

        ]
      },
    ]
  },
  {
    "Category1Code": "P",
    "Category1Name": "教育",
    "Category2Array": [{
      "Category2Code": "83",
      "Category2Name": "教育",
      "Category3Array": [{
          'Category3Code': '831',
          'Category3Name': '学前教育',
        },
        {
          'Category3Code': '832',
          'Category3Name': '初等教育',
        },
        {
          'Category3Code': '833',
          'Category3Name': '中等教育',
        },
        {
          'Category3Code': '834',
          'Category3Name': '高等教育',
        },
        {
          'Category3Code': '835',
          'Category3Name': '特殊教育',
        },
        {
          'Category3Code': '839',
          'Category3Name': '技能培训、教育辅助及其他教育',
        },
      ]
    }, ]
  },
  {
    "Category1Code": "R",
    "Category1Name": "文化、体育和娱乐业",
    "Category2Array": [{
        "Category2Code": "86",
        "Category2Name": "新闻和出版业",
        "Category3Array": [{
            'Category3Code': '861',
            'Category3Name': '新闻业',
          },
          {
            'Category3Code': '862',
            'Category3Name': '出版业',
          },
        ]
      },
      {
        "Category2Code": "87",
        "Category2Name": "广播、电视、电影和录音制作业",
        "Category3Array": [{
            'Category3Code': '871',
            'Category3Name': '广播',
          },
          {
            'Category3Code': '872',
            'Category3Name': '电视',
          },
          {
            'Category3Code': '873',
            'Category3Name': '影视节目制作',
          },
          {
            'Category3Code': '874',
            'Category3Name': '广播电视集成播控',
          },
          {
            'Category3Code': '875',
            'Category3Name': '电影和广播电视节目发行',
          },
          {
            'Category3Code': '876',
            'Category3Name': '电影放映',
          },
          {
            'Category3Code': '877',
            'Category3Name': '录音制作',
          },

        ]
      },
      {
        "Category2Code": "88",
        "Category2Name": "文化艺术业",
        "Category3Array": [{
            'Category3Code': '881',
            'Category3Name': '文艺创作与表演',
          },
          {
            'Category3Code': '882',
            'Category3Name': '艺术表演场馆',
          },
          {
            'Category3Code': '883',
            'Category3Name': '图书馆与档案馆',
          },
          {
            'Category3Code': '884',
            'Category3Name': '文物及非物质文化遗产保护',
          },
          {
            'Category3Code': '885',
            'Category3Name': '博物馆',
          },
          {
            'Category3Code': '886',
            'Category3Name': '烈士陵园、纪念馆',
          },
          {
            'Category3Code': '887',
            'Category3Name': '群众文体活动',
          },
          {
            'Category3Code': '889',
            'Category3Name': '其他文化艺术业',
          },

        ]
      },
      {
        "Category2Code": "89",
        "Category2Name": "体育",
        "Category3Array": [{
            'Category3Code': '891',
            'Category3Name': '体育组织',
          },
          {
            'Category3Code': '892',
            'Category3Name': '体育场地设施管理',
          },
          {
            'Category3Code': '893',
            'Category3Name': '健身休闲活动',
          },
          {
            'Category3Code': '899',
            'Category3Name': '其他体育',
          },

        ]
      },
      {
        "Category2Code": "90",
        "Category2Name": "娱乐业",
        "Category3Array": [{
            'Category3Code': '901',
            'Category3Name': '室内娱乐活动',
          },
          {
            'Category3Code': '902',
            'Category3Name': '游乐园',
          },
          {
            'Category3Code': '903',
            'Category3Name': '休闲观光活动',
          },
          {
            'Category3Code': '904',
            'Category3Name': '彩票活动',
          },
          {
            'Category3Code': '905',
            'Category3Name': '文化体育娱乐活动与经纪代理服务 文化活动服务',
          },
          {
            'Category3Code': '909',
            'Category3Name': '其他娱乐业',
          },

        ]
      },
    ]
  },

];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商品分类参数
    sortarray: [],

  },


  ProductSortUpdate() {
    // 数据库的设置不是管理员本人所以需要用云函数更新
    wx.cloud.callFunction({
      // 云函数名称
      name: 'MeetingRoomSetting',
      // 传给云函数的参数
      data: {
        key1: "ProductSort",
        value1: ProductSortArray,
      },
      success: res => {
        console.log("更新产品类别执行了")
      }
    })
  },
  BusinessSortUpdate() {
    const db = wx.cloud.database()
    db.collection('NameCardSetting').doc('0122a5876443793e098bd33e0045f553').update({
      data: {
        BusinessSortArray: BusinessSortArray,
      },
      success: res => {
        console.log(res)
      }
    })
  },
  bvCategory1Code(e) {
    let index = e.currentTarget.dataset.index

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //SortArray没有在pages data当中，所以不需要用this.data,
    this.setData({
      sortarray: ProductSortArray
    })
    console.log(this.data.sortarray)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})