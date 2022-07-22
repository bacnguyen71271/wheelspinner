<template>
<div>
    <b-modal id="chuc-mung" centered>
        <template #modal-header>
            <h5>Chúc mừng</h5>
        </template>
        <p>Bạn đã nhận được <strong>{{ phanThuong }}</strong></p>
        <template #modal-footer>
            <b-button @click="$bvModal.hide('chuc-mung')" variant="outline-success">Xác nhận</b-button>
        </template>
    </b-modal>
    <div class="nav d-flex justify-content-end border-bottom">
        <router-link to="/products" class="p-2">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        </router-link>
    </div>
    <div class="d-flex justify-content-center mt-5 p-1" id="spinner-page" v-if="prizesCanvas">
        <FortuneWheel :prizeId="prizeId" :style="{ width: wheelWidth + 'px', height: wheelWidth + 'px' }" :verify="canvasVerify" :canvas="canvasOptions" :prizes="prizesCanvas" @rotateStart="onCanvasRotateStart" @rotateEnd="onRotateEnd" />
    </div>
    <b-button @click="Test">test</b-button>
</div>
</template>

<script>
import FortuneWheel from '../components/fortuneWheel'

import {
    BButton
} from 'bootstrap-vue'

export default {
    components: {
        FortuneWheel,
        BButton,
    },
    data() {
        return {
            phanThuong: '',
            prizeId: 0,
            canvasVerify: true,
            canvasOptions: {
                btnWidth: 50,
                borderColor: '#584b43',
                borderWidth: 10,
                lineHeight: 90,
                btnText: "GO",
                radius: 1000,
                textRadius: 900,
                textDirection: 'vertical',
                fontSize: 120,
                textLength: 10
            },
            prizesCanvas: [],
        }
    },
    created() {
        this.getProductItems();
    },
    computed: {
        wheelWidth() {
            const width = document.body.clientWidth
            const height = document.body.clientHeight
            return width > height ? height - 400 : width
        }
    },
    methods: {
        Test() {
            this.canvasOptions.textLength = 5
        },
        getProductItems() {
            const prizeItem = localStorage.getItem('prizeItem')
            if (prizeItem) {
                this.prizesCanvas = JSON.parse(prizeItem)
            } else {
                this.prizesCanvas = []
                this.$router.push({path: '/products'})
            }
        },
        onCanvasRotateStart(rotate) {
            if (this.canvasVerify) {
                const verified = true
                this.DoServiceVerify(verified, 2000).then((verifiedRes) => {
                    if (verifiedRes) {
                        console.log('Đã thông qua xác minh, bắt đầu quay')
                        rotate()
                        // this.canvasVerify = false
                    } else {
                        alert('Không xác minh được')
                    }
                })
                return
            }
            console.log('onCanvasRotateStart')
        },
        onImageRotateStart() {
            console.log('onImageRotateStart')
        },
        onRotateEnd(prize) {
            // quay den se giam di 1
            const index = this.prizesCanvas.findIndex(el => el.id == prize.id)
            this.prizesCanvas[index].amount = this.prizesCanvas[index].amount - 1

            this.updateStore()

            this.phanThuong = prize.name

            this.$bvModal.show('chuc-mung')
        },
        updateStore () {
            localStorage.setItem('prizeItem', JSON.stringify(this.prizesCanvas))
        },
        onChangePrize(id) {
            this.prizeId = id
        },
        /**
         * verified: xac minh hay k
         * duration: thoi gian tre
         */
        DoServiceVerify() {
            return new Promise((resolve, reject) => {
                const self = this
                const checkItemAmount = this.prizesCanvas.filter(el => el.amount > 0)
                if (checkItemAmount.length == 0) {
                    this.$bvModal.msgBoxOk('Không còn sản phẩm nào, hãy bổ xung thêm', {
                        title: 'Opps!',
                        size: 'sm',
                        buttonSize: 'sm',
                        okVariant: 'success',
                        headerClass: 'p-2 border-bottom-0',
                        footerClass: 'p-2 border-top-0',
                        centered: true
                    })
                    .then(() => {
                        self.$router.push({path: '/products'})
                    })

                    reject()
                } else {
                    const randomIndex = this.getRandomInt(0, checkItemAmount.length - 1)
                    this.prizeId = checkItemAmount[randomIndex].id
                    console.log(this.prizeId)
                    resolve(true)
                }
            })
        },
        getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
}
</script>

<style scoped>
#spinner-page {
    min-height: 100vh;
}

#chuc-mung header {
    padding: 5px;
    padding-top: 20px;
    text-align: center !important;
    display: block;
    border: none;
}

#chuc-mung footer {
    display: block;
    padding: 0;
    padding-bottom: 10px;
    border: none;
}

#chuc-mung {
    text-align: center;
}
</style>
