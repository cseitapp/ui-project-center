<template>
  <v-container>
    <div class="text-center mb-2">
      <img src="~/assets/img/logo/logo_cse.png" height="80" />
      <h2 class="text-secondary">ຍິນດີຕ້ອນຮັບເຂົ້າສູ່ລະບົບ CSE Community</h2>
    </div>
    <div v-if="projectStore.getProjecGroup.length > 0">
      <div v-for="group in projectStore.getProjecGroup">
        <div class="d-flex">
          <div
            v-if="
              projectStore.getProjectList.filter(
                (el) => el.GROUP_ID == group.GROUP_ID
              ).length > 0
            "
            class="mt-6"
          >
            <v-row :align="'center'" class="ma-0">
              <Icon
                name="oui:editor-item-align-right"
                class="mr-2"
                size="1.6rem"
              />
              <h3>{{ group.GROUP_NAME }}</h3>
            </v-row>

            <div class="d-flex flex-wrap">
              <v-card
                v-for="pro in projectStore.getProjectList.filter(
                  (el) => el.GROUP_ID == group.GROUP_ID
                )"
                rounded="xl"
                elevation="0"
                class="ma-2 m-cursor"
                min-width="160"
              >
                <v-card-title>
                  <v-row class="ma-0" :align="'center'">
                    <div>
                      <code-to-text
                        v-if="pro.PRO_STATUS != 'A'"
                        :data="
                          utilStore.acGetCodetoText(
                            projectStore.getProjectStatus,
                            pro.PRO_STATUS
                          )
                        "
                        class="mr-2 text-second"
                      ></code-to-text>
                    </div>
                    <v-spacer></v-spacer>
                    <v-menu>
                      <template v-slot:activator="{ props }">
                        <Icon
                          name="pepicons-pop:dots-y"
                          style="cursor: pointer"
                          v-bind="props"
                        />
                      </template>

                      <v-card rounded="lg">
                        <v-card-text>
                          <v-table>
                            <tr>
                              <td class="text-right pr-2">
                                <span class="text-secondary mr-1"
                                  >{{ $t("id") }}:
                                </span>
                              </td>
                              <td>
                                <v-chip class="mb-2" label color="success">
                                  {{ pro?.PRO_ID }}</v-chip
                                >
                              </td>
                            </tr>
                            <tr>
                              <td class="text-right pr-2">
                                <span class="text-secondary mr-1"
                                  >ຊື່ລະບົບ:</span
                                >
                              </td>
                              <td>
                                <div>
                                  <p>
                                    {{ pro?.PRO_NAME_LA }}
                                  </p>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td class="text-right pr-2">
                                <span class="text-secondary mr-1"
                                  >ຊື່ພາສາອັງກິດ:</span
                                >
                              </td>
                              <td>
                                <div>
                                  <p>
                                    {{ pro?.PRO_NAME_EN }}
                                  </p>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td class="text-right pr-2">
                                <span class="text-secondary mr-1"
                                  >{{ $t("type") }}:</span
                                >
                              </td>
                              <td>
                                <code-to-text
                                  :data="
                                    utilStore.acGetCodetoText(
                                      projectStore.getProjectType,
                                      pro?.PRO_TYPE
                                    )
                                  "
                                ></code-to-text>
                              </td>
                            </tr>
                            <tr>
                              <td class="text-right pr-2">
                                <span class="text-secondary mr-1"
                                  >{{ $t("Address") }}:</span
                                >
                              </td>
                              <td>
                                <a :href="pro?.ADDRESS" target="_blank">
                                  {{ pro?.ADDRESS }}</a
                                >
                              </td>
                            </tr>
                            <tr>
                              <td class="text-right pr-2">
                                <span class="text-secondary mr-1"
                                  >{{ $t("status") }}:</span
                                >
                              </td>
                              <td>
                                <code-to-text
                                  :data="
                                    utilStore.acGetActiveUnactiveStatus(
                                      pro?.PRO_STATUS
                                    )
                                  "
                                ></code-to-text>
                              </td>
                            </tr>
                          </v-table>
                        </v-card-text>
                      </v-card>
                    </v-menu>
                  </v-row>
                </v-card-title>
                <v-card-text
                  class="text-right"
                  @click="goToProject(pro.ADDRESS)"
                >
                  <div class="text-center">
                    <Icon :name="pro.PRO_ICON" size="5rem" />
                    <p>{{ pro.PRO_NAME_LA }}</p>
                    <p class="text-second">{{ pro.PRO_NAME_EN }}</p>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { Icon } from "#components";

definePageMeta({
  layout: "custom",
  middleware: ["auth", "menu"],
});

const nuxtApp = useNuxtApp();
const projectStore = useProjectStore();
const utilStore = useUtilStore();

const dataList = ref<ProjectListModel[]>([]);

onMounted(async () => {
  await projectStore.acGetProjectGroup({
    status: "A",
  });
  await onLoadProjectList();
});

const onLoadProjectList = async () => {
  nuxtApp.$openLoading();
  await projectStore.acGetProjectList({ status: "", type: "W" });
  dataList.value = projectStore.getProjectList;
  nuxtApp.$closeLoading();
};

const goToProject = async (url: string) => {
  if (url) {
    window.open(url, "_blank");
  }
};
</script>
