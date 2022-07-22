<template>
<div>
    <b-modal id="modal-product-add" centered :title="modalTitle" @ok="addItemAction">
        <b-form>
            <b-form-group id="input-group-1" label="Tên sản phẩm:" label-for="input-1" description="Tên sản phẩm này sẽ hiển thị tại vòng quay">
                <b-form-input id="input-1" v-model="form.name" type="email" placeholder="Tên sản phẩm" required></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-2" label="Số lượng:" label-for="input-2">
                <b-form-input id="input-2" v-model="form.amount" placeholder="Số lượng" required type="number"></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-3" label="Số lượng:" label-for="input-2">
                <b-form-input id="input-group-3" type="color" v-model="form.bgColor"></b-form-input>

                {{ form.bgColor }}
            </b-form-group>
        </b-form>
    </b-modal>
    <div class="nav d-flex justify-content-start border-bottom">
        <router-link to="/" class="p-2">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Quay lại
        </router-link>
    </div>
    <b-card title="Danh sách phần quà">
        <div class="d-flex justify-content-end mb-2">
            <b-button @click="addItemBtn">Thêm</b-button>
        </div>
        <b-card-text>
            <b-table striped hover :items="items" fixed :fields="fields">
                <template #cell(name)="data">
                    <span class="d-block p-1" :style="{color: data.item.color, backgroundColor: data.item.bgColor }">{{ data.value }}</span>
                </template>
                <template #cell(id)="data">
                    <b-button size="sm" variant="outline-primary" class="mr-2" @click="editItem(data.value)">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </b-button>
                    <b-button size="sm" variant="outline-danger" @click="removeItem(data.value)">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </b-button>
                </template>
            </b-table>
        </b-card-text>
    </b-card>
</div>
</template>

<script>
import {
    BCard,
    BCardText,
    BTable,
    BButton,
    BModal,
    VBModal,
    BForm,
    BFormGroup,
    BFormInput,
} from 'bootstrap-vue'

export default {
    components: {
        BCard,
        BCardText,
        BTable,
        BButton,
        BModal,
        BForm,
        BFormGroup,
        BFormInput,
    },
    directives: {
        'b-modal': VBModal
    },
    data() {
        return {
            form: {
                name: '',
                amount: 0,
                id: 0,
                edit: false,
                bgColor: '',
                value: '',
                color: '',
                probability: 0
            },
            items: [],
            fields: [
                { key: 'name', label: 'Tên sản phẩm' },
                { key: 'amount', label: 'Số lượng' },
                { key: 'id', lable: 'Action' }
            ]
        }
    },
    created () {
        this.getProductItems();
    },
    computed: {
        modalTitle () {
            return this.form.edit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'
        }
    },
    methods: {
        initFormValue () {
            this.form.amount = 0,
            this.form.name = '';
            this.form.id = new Date().getTime()
        },
        editItem(id) {
            const item = this.items.find(el => el.id == id)
            this.form = JSON.parse(JSON.stringify(item))
            this.form.edit = true

            this.$bvModal.show('modal-product-add')
        },
        removeItem (id) {
            const index = this.items.findIndex(el => el.id == id)
            this.items.splice(index, 1)

            for (let index = 0; index < this.items.length; index++) {
                this.items[index].probability = 100/this.items.length
            }

            this.updateStore()
        },
        updateStore () {
            localStorage.setItem('prizeItem', JSON.stringify(this.items))
        },
        randomColor() {
            return `#${Math.floor(Math.random()*16777215).toString(16)}`;
        },
        addItemBtn() {
            this.form.name = '',
            this.form.amount = 0
            this.form.edit = false
            this.form.value = ''
            this.form.bgColor = this.randomColor(),
            this.form.color = '#ffffff',
            this.form.probability = 0

            console.log(this.form)

            this.$bvModal.show('modal-product-add')
        },
        addItemAction() {
            
            this.form.amount = parseInt(this.form.amount)

            if (this.form.edit) {
                const index = this.items.findIndex(el => el.id == this.form.id)
                const clone = JSON.parse(JSON.stringify(this.form))
                this.items[index].name = clone.name
                this.items[index].bgColor = clone.bgColor
                this.items[index].amount = clone.amount
            } else {
                this.form.id = new Date().getTime()
                this.form.value = this.form.name
                this.items.unshift(JSON.parse(JSON.stringify(this.form)))
            }

            for (let index = 0; index < this.items.length; index++) {
                this.items[index].probability = 100/this.items.length
            }

            this.updateStore()

            this.$bvToast.toast(`Thành công`, {
                title: 'Thông báo',
                autoHideDelay: 5000,
                variant: 'success',
                toaster: 'b-toaster-bottom-center'
            })
        },
        getProductItems () {
            const prizeItem = localStorage.getItem('prizeItem')
            if (prizeItem) {
                this.items = JSON.parse(prizeItem)
            } else {
                this.items = []
            }
        },
    }
}
</script>

<style>

table td {
    padding: 2px !important;
    text-align: center;
}
table th {
    padding: 5px !important;
}

</style>
