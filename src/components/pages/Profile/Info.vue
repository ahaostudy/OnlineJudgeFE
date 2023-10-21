<template>
    <div id="user-info-container">
        <div class="user-avatar">
            <Avatar :avatar="props.user.avatar" :name="props.user.nickname" :show-edit-button="true" @click-icon="updateAvatar" :size="160" />
        </div>
        <div class="user-info-box">
            <div class="user-nickname">{{ props.user.nickname }}</div>
            <div class="user-relation">
                <div class="user-relation-item">
                    <div>{{ 0 }}</div>
                    <div>关注</div>
                </div>
                <div class="user-relation-item">
                    <div>{{ 0 }}</div>
                    <div>粉丝</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Avatar from '../../common/Avatar.vue';

const props = defineProps({
    user: {
        require: true,
        default: {
            id: 0,
            nickname: '',
            username: '',
            avatar: '',
            email: '',
            signature: '',
        },
    }
})

function updateAvatar() {
    console.log('update avatar');
}
</script>

<style scoped lang="less">
#user-info-container {
    display: flex;
    gap: 50px;

    .user-info-box {
        display: flex;
        flex-direction: column;
        gap: 60px;
        justify-content: center;
    }

    .user-nickname {
        font-size: 26px;
        font-weight: 600;
    }

    .user-relation {
        display: flex;
        gap: 20px;

        .user-relation-item {
            display: flex;
            gap: 8px;
        }
    }
}
</style>