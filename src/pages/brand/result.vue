<template>
  <div id="resultPage">
    <div class="nullBox" v-if="programFinished && contentData.length == 0">
      <img src="../../assets/null/list.png" width="100%" />
      <div>您搜索的内容为空</div>
    </div>
    <van-list
      v-else
      v-model="programLoading"
      :finished="programFinished"
      finished-text="没有更多了"
      @load="programLoad"
      class="list"
      v-else
    >
    <!-- <div> -->
      <div class="searhResult">
        <svg class="icon searchIcon" aria-hidden="true">
          <use xlink:href="#icon-search-line" />
        </svg>
        <input type="text" v-model="searchContent" @focus="inputText" />
        <span class="cancel" @click="inputText">取消</span>
      </div>
      <van-tabs
        sticky
        animated
        color="#666"
        title-active-color="#333"
        @click="tabChange"
        v-if="column_list.length > 0"
        v-model="activekey"
      >
        <van-tab :title="items.name" v-for="(items,index) in column_list" :key="index">
          <template v-if="activekey == index">
            <!-- <van-list
              v-model="programLoading"
              :finished="programFinished"
              finished-text="没有更多了"
              @load="programLoad"
            > -->
              <div v-for="(item,index) in brandData" :key="index">
                <!-- 图书,专辑 -->
                <div
                  class="content book"
                  @click="gotoDetail(item)"
                  v-if="item.goods_type == 3 || item.goods_type == 9"
                >
                  <div class="ratiobook">
                    <div class="bookimg" v-lazy:background-image="item.pic[0]"></div>
                  </div>
                  <div class="right">
                    <div class="text">{{item.title}}</div>
                    <div class="pinpai">{{item.sub_title}}</div>
                    <div class="nice">
                      <span class="good" v-if="item.goods_type == 6">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-good-line" />
                        </svg>
                        <span>{{item.praise_num}}</span>
                      </span>
                      <span class="price" v-if="item.goods_type == 3">
                        <span>￥{{ item.price }}</span>
                      </span>
                      <span class="comment" v-if="item.goods_type == 9">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-album-line" />
                        </svg>
                        <span>共{{ item.item_count }}集</span>
                      </span>
                    </div>
                  </div>
                </div>
                <!-- 文章 -->
                <div class="content" @click="gotoDetail(item)" v-if="item.goods_type == 6">
                  <div class="ratiobox">
                    <div class="bookImg" v-lazy:background-image="item.pic[0]"></div>
                  </div>
                  <div class="right">
                    <div class="text">{{item.title}}</div>
                    <div class="pinpai">{{item.sub_title}}</div>
                    <div class="nice">
                      <span class="good" v-if="item.goods_type == 6">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-good-line" />
                        </svg>
                        <span>{{item.praise_num}}</span>
                      </span>
                      <span class="comment">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-comment-line" />
                        </svg>
                        <span>{{ item.comment_num }}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <!-- 音视频 -->
                <div
                  class="content audio"
                  @click="gotoDetail(item)"
                  v-if="item.goods_type == 1 || item.goods_type == 2"
                >
                  <div class="ratiobox">
                    <div class="bookImg" v-lazy:background-image="item.pic[0]"></div>
                  </div>
                  <div class="right">
                    <div class="text">{{item.title}}</div>
                    <div class="pinpai">{{item.sub_title}}</div>
                    <div class="nice">
                      <span class="good">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-time-line" />
                        </svg>
                        <span>{{item.duration}}</span>
                      </span>
                      <span class="price">
                        <!-- <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-comment-line" />
                        </svg>-->
                        <span v-if="item.price">￥{{ item.price }}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <!-- 电子书 -->
                <div class="content ebook" @click="gotoDetail(item)" v-if="item.goods_type == 4">
                  <div class="ratiobox">
                    <div class="bookImg" v-lazy:background-image="item.pic[0]"></div>
                  </div>
                  <div class="right">
                    <div class="text">{{item.title}}</div>
                    <!-- <div class="pinpai">{{item.sub_title}}</div> -->
                    <div class="nice">
                      <span class="good">
                        <!-- <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-time-line" />
                        </svg>-->
                        <span>{{item.book_author}}</span>
                      </span>
                      <span class="price">
                        <!-- <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-comment-line" />
                        </svg>-->
                        <span v-if="item.price">￥{{ item.price }}</span>
                        <span v-else>免费</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            <!-- </van-list> -->
          </template>
        </van-tab>
      </van-tabs>
    <!-- </div> -->
    </van-list>
    <EazyNav type="brand" :isShow="true"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/brand/result.scss" scoped lang="scss"></style>

<script>
import { BRAND_SEARCH_GOODS_GETS } from "../../apis/brand.js";
import { WX_SHARE } from "../../apis/public.js";
// import easyNav from "../../components/easyNav";
import resultVue from "../personal/order/result.vue";
export default {
  // components: {
  //   easyNav
  // },
  data() {
    return {
      // navData: {
      //   fold: false,
      //   home: true,
      //   homeLink: "/",
      //   search: true,
      //   searchLink: "/search",
      //   personal: true,
      //   personalLink: "/personal/index",
      //   type: "brand"
      // },
      state: "brand",
      brandData: [],
      bookData: [],
      column_list: [],
      programLoading: false,
      programFinished: false,
      // 搜索结果参数
      goods_type: null,
      searchContent: "",
      activekey: 0,
      page: 1,
      title: null,
      page_size: 10,
      contentData: [],
      supplier_id: null,
      tagids: null,
      cids: null,
      isbrand_id: null
    };
  },
  mounted() {
    this.isbrand_id = this.$route.query.isbrand_id
      ? this.$route.query.isbrand_id
      : null;
    this.searchContent = this.$route.query.searchContent
      ? this.$route.query.searchContent
      : null;
    this.goods_type = this.$route.query.goods_type;
    this.supplier_id = this.$route.query.supplier_id
      ? parseInt(this.$route.query.supplier_id)
      : 0;
    this.tagids = this.$route.query.tagids ? this.$route.query.tagids : null;
    this.cids = this.$route.query.cids ? this.$route.query.cids : null;

    // title
    this.title = this.$route.query.title ? this.$route.query.title : "";
    document.title = "搜索结果-" + this.title;

    // this.getGoodsColum();
    // this.getGoods();
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  },
  methods: {
    gotoDetail(item) {
      var goodsType = item.goods_type;
      if (goodsType == 1 || goodsType == 2) {
        // 音频/视频，当前页更新
        this.$router.push({
          name: "albumdetail",
          query: { goods_id: item.goods_id }
        });
      } else if (goodsType == 6) {
        // 文章
        this.$router.push({
          name: "article",
          query: { goods_id: item.goods_id }
        });
      } else if (goodsType == 9) {
        // 专辑
        this.$router.push({
          name: "album",
          query: { goods_id: item.goods_id }
        });
      } else if (goodsType == 3) {
        // 图书
        this.$router.push({
          name: "detail",
          query: { goods_id: item.goods_id }
        });
      } else if (goodsType == 4) {
        // 电子书
        this.$router.push({
          name: "ebookdetail",
          query: { goods_id: item.goods_id }
        });
      }
    },
    programLoad() {
      this.getGoods();
    },
    async getGoods() {
      var tStamp = this.$getTimeStamp();
      var data = {
        keywords: this.searchContent,
        goods_type: this.goods_type,
        brand_id: this.isbrand_id == "no" ? 0 : this.$route.query.brand_id,
        supplier_id: this.supplier_id,
        tagids: this.tagids,
        cids: this.cids,
        page: this.page,
        page_size: this.page_size,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await BRAND_SEARCH_GOODS_GETS(data);

      if (res.hasOwnProperty("response_code")) {
        var result = res.response_data.result;
        this.column_list = res.response_data.column;
        var _index = 0;
        for (let i = 0; i < this.column_list.length; i++) {
          if (this.column_list[i].goods_type == this.goods_type) {
            _index = i;
          }
        }
        this.activekey = _index;
        setTimeout(() => {
          for (let i = 0; i < result.length; i++) {
            this.brandData.push(result[i]);
            this.contentData.push(result[i]);
          }
          this.programLoading = false;
          this.page++;
          // console.log('thispage',this.page)
          // 数据全部加载完成
          if (this.page > res.response_data.total_page) {
            this.programFinished = true;
            this.page = 1;
          }
        }, 1);

        获取页面分享信息
        var _pageName = "";
        var _params = "";
        switch (this.$route.query.type) {
          case "mall":
            var tmp = {};
            tmp.supplier_id = this.$route.query.supplier_id;
            tmp.brand_id = this.$route.query.brand_id;
            if (this.$route.query.searchContent)
              tmp.keywords = this.$route.query.searchContent;
            if (this.$route.query.goods_type)
              tmp.goods_type = this.$route.query.goods_type;
            _pageName = "mall/goods/search";
            _params = JSON.stringify(tmp);
            break;
          case "brand":
            _pageName = "brand/goods/search";
            _params = JSON.stringify({
              brand_id: this.$route.query.brand_id,
              keywords: this.$route.query.searchContent
            });
            break;
          case "index":
            _pageName = "brand/goods/search";
            _params = JSON.stringify({
              brand_id: this.$route.query.brand_id,
              keywords: this.$route.query.searchContent
            });
            break;
        }
        if (this.isWxLogin) this.$getWxShareData(_pageName, _params);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 跳转搜索页
    inputText() {
      this.$router.push({
        name: "search",
        query: {
          type: this.$route.query.type,
          brand_id: this.$route.query.brand_id,
          supplier_id: this.$route.query.supplier_id
        }
      });
    },
    // 点击tab页切换
    tabChange(index, title) {
      this.activekey = index;
      this.brandData = [];
      this.programFinished = false;
      this.page = 1;
      this.goods_type = Number(this.column_list[index].goods_type);
    }
  }
};
</script>

