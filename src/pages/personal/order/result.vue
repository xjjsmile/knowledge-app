<template>
  <div id="listPage">
    <div class="nullBox" v-if="programFinished && publishData.length == 0">
      <img src="../../../assets/null/list.png" width="100%" />
      <div>您搜索的内容为空</div>
    </div>
    <!-- <div class="content">
      <div class="head">
        <div class="titleFrom">
          <img v-lazy="iconUrl" class="icon">
          <span class="publish">浙江出版传媒集团</span>
        </div>
        <span class="order1">待支付</span>
      </div>
      <div class="section">
        <swiper class="swiperTags" :options="swiperOption" ref="mySwiper">
          <swiper-slide>
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="imgUrl"></a>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="imgUrl"></a>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="imgUrl"></a>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="imgUrl"></a>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="imgUrl"></a>
            </div>
          </swiper-slide>
        </swiper>
        <div class="tip1">
          <span class="actulPay">
            实付款：
            <span class="money">￥ 134.00</span>
          </span>
        </div>
      </div>
      <div class="foot">
        <span class="button2">去支付</span>
      </div>
    </div>-->

    <!-- <div class="content">
      <div class="head">
        <div class="titleFrom">
          <img v-lazy="iconUrl" class="icon">
          <span class="publish">浙江出版传媒集团</span>
        </div>
        <span class="order2">已完成</span>
      </div>
      <div class="section">
        <swiper class="swiperTags" :options="swiperOption" ref="mySwiper">
          <swiper-slide>
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="imgUrl"></a>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="imgUrl"></a>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="imgUrl"></a>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="imgUrl"></a>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="imgUrl"></a>
            </div>
          </swiper-slide>
        </swiper>
        <div class="tip1">
          <span class="actulPay">
            实付款：
            <span class="money">￥ 134.00</span>
          </span>
        </div>
      </div>
      <div class="footFinish">
        <span class="more">更多</span>
        <div>
          <span class="button1">评价</span>
          <span class="button1">再次购买</span>
        </div>
      </div>
    </div>-->
    <van-list
      v-model="programLoading"
      :finished="programFinished"
      finished-text="没有更多了"
      @load="programLoad"
      v-else
    >
      <div class="content" v-for="item in publishData" @click="toDetail(item)">
        <div class="head">
          <div class="titleFrom">
            <!-- <img v-lazy="item.brand_header_pic" alt class="icon"> -->
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="item.brand_header_pic"></a>
            </div>
            <span class="publish">{{item.brand_name}}</span>
          </div>
          <span :class="item.state ==0? 'order1':'order2'">{{item.state_desc}}</span>
        </div>
        <div class="section" v-for="item1 in item.details">
          <div class="bookDetail">
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="item1.pic"></a>
            </div>
            <span class="title">{{item1.goods_name}}</span>
          </div>
        </div>
        <div class="tip2">
          <div>
            <span class="noChange" v-if="item.type == 1">虚拟内容不退不换</span>
          </div>
          <span class="actulPay">
            实付款：
            <span class="money">￥{{item.order_money}}</span>
          </span>
        </div>
        <!-- <div class="foot">
        <span class="button1">评价</span>
        <span class="button1" v-if="item.state ==1">再次购买</span>
        <span class="button2" >去支付</span>
        <span class="button2" v-if="item.state ==0">确认收货</span>
        </div>-->
      </div>
    </van-list>
    <!-- <easyNav :navData="navData"></easyNav> -->
    <EazyNav type="brand" :isShow="true"></EazyNav>
  </div>
</template>


<style scoped  src="@/style/scss/pages/personal/order/list.scss" lang="scss"></style>

<script>
// import easyNav from "./../../../components/easyNav";
import { USER_ORDER_DETAIL_GETS } from "../../../apis/user.js";
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
      //   type: "order"
      // },
      publishData: [],
      swiperOption: {
        slidesPerView: 5.3
      },
      programLoading: false,
      programFinished: false,
      page: 1,
      page_size: 10,
      type: "order",
      searchContent: "",
      state: null
    };
  },
  mounted() {
    this.searchContent = this.$route.query.searchContent;
    this.state = this.$route.query.state;
    document.title = '搜索结果';
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
  },
  methods: {
    programLoad() {
      this.getData();
    },
    async getData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        // order_id:1905062000270095,
        page: this.page,
        page_size: this.page_size,
        goods_name: this.searchContent,
        order_state: this.state,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await USER_ORDER_DETAIL_GETS(data);
      if (res.hasOwnProperty("response_code")) {
        var result = res.response_data.result;
        setTimeout(() => {
          for (let i = 0; i < result.length; i++) {
            this.publishData.push(result[i]);
          }
          this.programLoading = false;
          this.page++;

          // 数据全部加载完成
          if (this.page > res.response_data.total_page) {
            this.programFinished = true;
          }
        }, 500);
      } else {
        this.$toast(res.error_message);
        this.programFinished = true;
      }
    },
    toDetail(item) {
      // console.log(item)
      this.$router.push({
        name: "orderdetail",
        query: {
          order_id: item.order_id
        }
      });
    }
  }
};
</script>


