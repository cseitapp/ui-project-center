<template>
  <v-container fluid>
    <v-row class="ma-0">
      <v-btn variant="text" @click="$router.back()">
        <div class="d-flex align-center">
          <Icon name="material-symbols:arrow-back-2" class="mr-1" />
          {{ $t("back") }}
        </div>
      </v-btn>
      <v-spacer></v-spacer>
    </v-row>

    <div class="py-2">
      <div v-if="orgUserSeleted" class="mb-4">
        <v-card elevation="0" rounded="xl">
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="8" md="10">
                <v-row class="ma-0" :align="'center'">
                  <div class="mb-2">
                    <div>
                      <v-avatar color="grey" size="100" class="ml-2">
                        <v-img
                          :src="nuxtApp.$profilePath(orgUserSeleted?.PICTURE)"
                          cover
                          ><template v-slot:placeholder>
                            <v-row
                              :align="'center'"
                              class="fill-height ma-0"
                              justify="center"
                            >
                              <v-progress-circular
                                color="grey-lighten-5"
                                indeterminate
                              ></v-progress-circular>
                            </v-row>
                          </template>
                          <template v-slot:error>
                            <v-img
                              cover
                              class="rounded-lg"
                              src="~/assets/img/profile.jpg"
                            ></v-img> </template
                        ></v-img>
                      </v-avatar>
                    </div>
                    <div class="pt-2 text-center">
                      <v-btn
                        color="success"
                        variant="tonal"
                        size="small"
                        @click="searchEmployeeModal = true"
                        ><Icon
                          name="material-symbols:new-label-outline-sharp"
                          class="mr-1 text-success"
                          size="1.2rem"
                        ></Icon
                        >ເລືອກໃໝ່</v-btn
                      >
                    </div>
                  </div>
                  <v-col>
                    <v-row class="ma-0" :align="'center'">
                      <v-chip label :color="'primary'"
                        ><b>{{ orgUserSeleted?.USER_NAME }}</b></v-chip
                      >
                      <div class="px-2">
                        <p>{{ orgUserSeleted?.FULL_NAME_LA }}</p>
                        <p>{{ orgUserSeleted?.FULL_NAME_EN }}</p>
                      </div></v-row
                    >
                    <div>
                      <p>
                        <span class="text-secondary"
                          >{{ $t("positionLevel") }}:</span
                        >
                        {{ orgUserSeleted?.POS_NAME }}
                      </p>
                      <p>
                        <span class="text-secondary"
                          >{{ $t("position") }}:</span
                        >
                        {{ orgUserSeleted?.POS_DESC }}
                      </p>
                      <p>
                        <span class="text-secondary">{{ $t("team") }}:</span>
                        {{ orgUserSeleted?.TEAM_NAME }}
                      </p>
                      <p>
                        <span class="text-secondary">{{ $t("section") }}:</span>
                        {{ orgUserSeleted?.SEC_NAME }}
                      </p>
                      <p>
                        <span class="text-secondary">{{ $t("branch") }}:</span>
                        {{ orgUserSeleted?.BR_NAME }}
                      </p>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col>
                <v-btn
                  color="secondary"
                  variant="tonal"
                  class="w-100 my-1"
                  @click="viewOrganization('ALL')"
                  ><Icon
                    name="iconoir:network"
                    class="mr-1 text-success"
                    size="1.2rem"
                  ></Icon
                  >ເບິ່ງຂໍ້ມູນສາຍງານທັງໝົດ</v-btn
                >

                <v-btn
                  color="secondary"
                  variant="tonal"
                  class="w-100 my-1"
                  @click="viewOrganization('UPPER')"
                  ><Icon
                    name="ph:network-light"
                    class="mr-1 text-warning"
                    size="1.2rem"
                  ></Icon
                  >ເບິ່ງຂໍ້ມູນສາຍງານ (Upper)</v-btn
                >

                <v-btn
                  color="secondary"
                  variant="tonal"
                  class="w-100 my-1"
                  @click="viewOrganization('DOWN')"
                  ><Icon
                    name="ph:network-light"
                    class="mr-1 text-error"
                    size="1.2rem"
                  ></Icon
                  >ເບິ່ງຂໍ້ມູນສາຍງານ (Under)</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>

      <div>
        <!-- {{ orgStore.getOrgManagementDetail }} -->
        <v-row>
          <v-col cols="12" lg="4">
            <div class="py-1">
              <v-row class="ma-0" :align="'center'">
                <Icon
                  name="material-symbols:info-outline-rounded"
                  class="mr-1"
                />
                <span class="text-secondary">ຂໍ້ມູນບ່ອນປະຈຳການ</span>
                <v-spacer></v-spacer>
                <v-btn
                  variant="tonal"
                  size="x-small"
                  icon=""
                  color="primary"
                  class="ma-1"
                  @click="addNewBranchModal = true"
                >
                  <Icon name="line-md:plus" class="text-primary" />
                </v-btn>
              </v-row>
            </div>

            <v-divider></v-divider>
            <div v-if="branchGroup.length <= 0" class="text-center">
              <no-data></no-data>
            </div>
            <div v-else>
              <v-card
                v-for="br in branchGroup"
                elevation="0"
                rounded="lg"
                class="my-2"
              >
                <v-card-text>
                  <v-row :align="'center'">
                    <v-col>
                      <p>{{ br.BR_NAME }}</p>
                      <p class="text-secondary">{{ br.BR_NAME_EN }}</p>
                    </v-col>
                    <v-btn
                      variant="text"
                      size="small"
                      icon=""
                      color="error"
                      class="ma-1"
                      @click="onDeleteBranch(br.BRANCH_ID)"
                    >
                      <Icon name="mdi-light:delete" class="text-error" />
                    </v-btn>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>

            <div class="py-1">
              <v-row class="ma-0" :align="'center'">
                <Icon
                  name="material-symbols:info-outline-rounded"
                  class="mr-1"
                />
                <span class="text-secondary">ຂໍ້ມູນຝ່າຍ</span>
                <v-spacer></v-spacer>
                <v-btn
                  variant="tonal"
                  size="x-small"
                  icon=""
                  color="primary"
                  class="ma-1"
                  @click="addNewSectionModal = true"
                >
                  <Icon name="line-md:plus" class="text-primary" />
                </v-btn>
              </v-row>
            </div>

            <v-divider></v-divider>
            <div v-if="sectionGroup.length <= 0" class="text-center">
              <no-data></no-data>
            </div>
            <div v-else>
              <div v-for="br in sectionGroup">
                <div class="pt-2">
                  <p>- {{ br.BR_NAME }}</p>
                </div>
                <v-card
                  v-for="sec in br.SECTION_LIST"
                  elevation="0"
                  rounded="lg"
                  class="my-2"
                >
                  <v-card-text>
                    <v-row :align="'center'">
                      <v-col>
                        <p>{{ sec.SEC_NAME }}</p>
                        <p class="text-secondary">{{ sec.SEC_NAME_EN }}</p>
                      </v-col>
                      <v-btn
                        variant="text"
                        size="small"
                        icon=""
                        color="error"
                        class="ma-1"
                        @click="onDeleteSection(sec.SECTION_ID)"
                      >
                        <Icon name="mdi-light:delete" class="text-error" />
                      </v-btn>
                    </v-row>
                  </v-card-text>
                </v-card>
              </div>
            </div>

            <div class="py-1">
              <v-row class="ma-0" :align="'center'">
                <Icon
                  name="material-symbols:info-outline-rounded"
                  class="mr-1"
                />
                <span class="text-secondary">ຂໍ້ມູນຂະແໜງ</span>
                <v-spacer></v-spacer>
                <v-btn
                  variant="tonal"
                  size="x-small"
                  icon=""
                  color="primary"
                  class="ma-1"
                  @click="addNewTeamModal = true"
                >
                  <Icon name="line-md:plus" class="text-primary" />
                </v-btn>
              </v-row>
            </div>

            <v-divider></v-divider>
            <div v-if="teamGroup.length <= 0" class="text-center">
              <no-data></no-data>
            </div>
            <div v-else>
              <div v-for="br in teamGroup">
                <div class="pt-2">
                  <p>- {{ br.BR_NAME }}</p>
                </div>
                <div v-for="sec in br.SECTION_LIST">
                  <div class="pl-4 pt-2">
                    <p>- {{ sec.SEC_NAME }}</p>
                  </div>
                  <v-card
                    v-for="team in sec.TEAM_LIST"
                    elevation="0"
                    rounded="lg"
                    class="my-2"
                  >
                    <v-card-text>
                      <v-row :align="'center'">
                        <v-col>
                          <p>{{ team.TEAM_NAME }}</p>
                          <p class="text-secondary">{{ team.TEAM_NAME }}</p>
                        </v-col>
                        <v-btn
                          variant="text"
                          size="small"
                          icon=""
                          color="error"
                          class="ma-1"
                          @click="onDeleteTeam(team.TEAM_ID)"
                        >
                          <Icon name="mdi-light:delete" class="text-error" />
                        </v-btn>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" lg="4">
            <div class="py-1">
              <v-row class="ma-0" :align="'center'">
                <Icon
                  name="material-symbols:info-outline-rounded"
                  class="mr-1"
                />
                <span class="text-secondary">ຂໍ້ມູນພະນັກງານ</span>
                <v-spacer></v-spacer>
                <v-btn
                  variant="tonal"
                  size="x-small"
                  icon=""
                  color="primary"
                  class="ma-1"
                  @click="addNewEmployeeModal = true"
                >
                  <Icon name="line-md:plus" class="text-primary" />
                </v-btn>
              </v-row>
            </div>
            <v-divider></v-divider>
            <div v-if="employeeGroup.length <= 0" class="text-center">
              <no-data></no-data>
            </div>
            <div v-else>
              <v-card
                v-for="emp in employeeGroup"
                elevation="0"
                rounded="lg"
                class="my-2"
              >
                <v-card-text>
                  <v-row class="ma-0" :align="'start'">
                    <div class="mb-2">
                      <div>
                        <v-avatar color="grey" size="80" class="mt-4">
                          <v-img :src="nuxtApp.$profilePath(emp?.PICTURE)" cover
                            ><template v-slot:placeholder>
                              <v-row
                                :align="'center'"
                                class="fill-height ma-0"
                                justify="center"
                              >
                                <v-progress-circular
                                  color="grey-lighten-5"
                                  indeterminate
                                ></v-progress-circular>
                              </v-row>
                            </template>
                            <template v-slot:error>
                              <v-img
                                cover
                                class="rounded-lg"
                                src="~/assets/img/profile.jpg"
                              ></v-img> </template
                          ></v-img>
                        </v-avatar>
                      </div>

                      <div class="text-center pt-2">
                        <p :class="'text-secondary'">
                          <b>{{ emp?.USER_NAME }}</b>
                        </p>
                      </div>
                    </div>
                    <v-col class="py-0">
                      <v-row class="ma-0" :align="'center'">
                        <v-col class="px-2">
                          <p>{{ emp?.FULL_NAME_LA }}</p>
                          <p>{{ emp?.FULL_NAME_EN }}</p>
                        </v-col>
                        <v-btn
                          variant="text"
                          size="small"
                          icon=""
                          color="error"
                          class="ma-1"
                          @click="onDeleteEmployee(emp.USER_NAME)"
                        >
                          <Icon
                            name="mdi-light:delete"
                            class="text-error"
                          /> </v-btn
                      ></v-row>
                      <div>
                        <p>
                          <span class="text-secondary"
                            >{{ $t("positionLevel") }}:</span
                          >
                          {{ emp?.POS_NAME }}
                        </p>
                        <p>
                          <span class="text-secondary"
                            >{{ $t("position") }}:</span
                          >
                          {{ emp?.POS_DESC }}
                        </p>
                        <p>
                          <span class="text-secondary">{{ $t("team") }}:</span>
                          {{ emp?.TEAM_NAME }}
                        </p>
                        <p>
                          <span class="text-secondary"
                            >{{ $t("section") }}:</span
                          >
                          {{ emp?.SEC_NAME }}
                        </p>
                        <p>
                          <span class="text-secondary"
                            >{{ $t("branch") }}:</span
                          >
                          {{ emp?.BR_NAME }}
                        </p>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
          <v-col cols="12" lg="4">
            <div class="py-1">
              <v-row class="ma-0" :align="'center'">
                <Icon
                  name="material-symbols:info-outline-rounded"
                  class="mr-1"
                />
                <span class="text-secondary">ຂໍ້ມູນຕຳແໜ່ງ</span>
                <v-spacer></v-spacer>
                <v-btn
                  variant="tonal"
                  size="x-small"
                  icon=""
                  color="primary"
                  class="ma-1"
                  @click="onOpenAddNewPositionModal"
                >
                  <Icon name="line-md:plus" class="text-primary" />
                </v-btn>
              </v-row>
            </div>
            <v-divider></v-divider>
            <div v-if="positionGroup.length <= 0" class="text-center">
              <no-data></no-data>
            </div>
            <v-card
              v-for="pos in positionGroup"
              elevation="0"
              rounded="lg"
              class="my-2"
            >
              <v-card-text>
                <v-row :align="'center'">
                  <v-col>
                    <p>{{ pos.POS_NAME }}</p>
                    <p class="text-secondary">{{ pos.POS_NAME_EN }}</p>
                  </v-col>
                  <v-btn
                    variant="text"
                    size="small"
                    icon=""
                    color="error"
                    class="ma-1"
                    @click="onDeletePosition(pos.POS_ID)"
                  >
                    <Icon name="mdi-light:delete" class="text-error" />
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-container>
  <!-- SEARCH EMPLOYEE -->
  <v-dialog v-model="searchEmployeeModal">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="0" rounded="lg">
          <v-card-title>
            <v-row class="ma-0" :align="'center'">
              <span>ຄົ້ນຫາພະນັກງານ</span><v-spacer></v-spacer>
              <v-btn
                variant="text"
                size="x-small"
                icon=""
                color="error"
                class="ma-1"
                @click="searchEmployeeModal = false"
              >
                <Icon name="ic:round-close" class="text-error" />
              </v-btn>
            </v-row>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="overflow-auto" style="max-height: 75vh">
            <div v-if="employeeSearchList.length <= 0" class="text-center">
              <no-data></no-data>
            </div>
            <div v-else class="mb-4">
              <v-row
                class="ma-0"
                :align="'start'"
                v-for="emp in employeeSearchList"
              >
                <div class="mb-2">
                  <div>
                    <v-avatar color="grey" size="80" class="mt-4">
                      <v-img :src="nuxtApp.$profilePath(emp?.PICTURE)" cover
                        ><template v-slot:placeholder>
                          <v-row
                            :align="'center'"
                            class="fill-height ma-0"
                            justify="center"
                          >
                            <v-progress-circular
                              color="grey-lighten-5"
                              indeterminate
                            ></v-progress-circular>
                          </v-row>
                        </template>
                        <template v-slot:error>
                          <v-img
                            cover
                            class="rounded-lg"
                            src="~/assets/img/profile.jpg"
                          ></v-img> </template
                      ></v-img>
                    </v-avatar>
                  </div>

                  <div class="text-center pt-2">
                    <p :class="'text-secondary'">
                      <b>{{ emp?.USER_NAME }}</b>
                    </p>
                  </div>
                </div>
                <v-col class="py-0">
                  <v-row class="ma-0" :align="'center'">
                    <v-col class="px-2">
                      <p>{{ emp?.FULL_NAME_LA }}</p>
                      <p>{{ emp?.FULL_NAME_EN }}</p>
                    </v-col>
                    <v-btn
                      variant="tonal"
                      size="small"
                      icon=""
                      color="success"
                      class="ma-1"
                      @click="onSelectEmployeeSearch(emp)"
                    >
                      <Icon
                        name="mingcute:check-2-line"
                        class="text-success"
                      /> </v-btn
                  ></v-row>
                  <div>
                    <p>
                      <span class="text-secondary"
                        >{{ $t("positionLevel") }}:</span
                      >
                      {{ emp?.POS_NAME }}
                    </p>
                    <p>
                      <span class="text-secondary">{{ $t("position") }}:</span>
                      {{ emp?.POS_DESC }}
                    </p>
                    <p>
                      <span class="text-secondary">{{ $t("team") }}:</span>
                      {{ emp?.TEAM_NAME }}
                    </p>
                    <p>
                      <span class="text-secondary">{{ $t("section") }}:</span>
                      {{ emp?.SEC_NAME }}
                    </p>
                    <p>
                      <span class="text-secondary">{{ $t("branch") }}:</span>
                      {{ emp?.BR_NAME }}
                    </p>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <div class="w-100">
              <v-text-field
                v-model="txtSearchUserName"
                color="text-secondary"
                variant="outlined"
                clearable
                density="comfortable"
                rounded="lg"
                :label="$t('UserName')"
                placeholder="CSE000,CSE000"
                @keyup.enter="onSearchEmployee"
              ></v-text-field>
              <v-btn
                color="primary"
                variant="flat"
                rounded="lg"
                class="w-100"
                @click="onSearchEmployee"
              >
                <Icon name="ic:sharp-search" class="text-white mr-1" />
                <span>{{ $t("Search") }}</span>
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-dialog>

  <!-- ADD NEW POSITION -->
  <v-dialog v-model="addNewPositionModal">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="0" rounded="lg">
          <v-card-title>
            <v-row class="ma-0" :align="'center'">
              <span>ເພີ່ມຕຳແໜ່ງ</span><v-spacer></v-spacer>
              <v-btn
                variant="text"
                size="x-small"
                icon=""
                color="error"
                class="ma-1"
                @click="addNewPositionModal = false"
              >
                <Icon name="ic:round-close" class="text-error" />
              </v-btn>
            </v-row>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="overflow-auto" :style="'max-height: 75vh;'">
            <div v-if="addNewPositionList.length <= 0" class="text-center">
              <no-data></no-data>
            </div>
            <div v-else class="mb-4">
              <div v-for="pos in addNewPositionList">
                <div
                  v-if="
                    positionGroup.filter((el) => el.POS_ID == pos.POS_ID)
                      .length > 0
                  "
                  class="pa-4"
                >
                  <p>
                    {{ pos.POS_NAME }}
                    <span class="ml-2 text-success">(ເພີ່ມແລ້ວ)</span>
                  </p>
                </div>
                <v-checkbox
                  v-else
                  v-model="addNewPositionSelected"
                  color="primary"
                  :label="pos.POS_NAME"
                  :value="pos.POS_ID"
                  hide-details
                ></v-checkbox>
              </div>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <div class="w-100">
              <v-btn
                color="primary"
                variant="flat"
                rounded="lg"
                class="w-100"
                @click="onInsertPosition()"
              >
                <Icon name="el:ok" class="text-white mr-1" />
                <span
                  >{{ $t("OK") }} ({{ addNewPositionSelected.length }})</span
                >
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-dialog>

  <!-- ADD NEW EMPLOYEE -->
  <v-dialog v-model="addNewEmployeeModal">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="0" rounded="lg">
          <v-card-title>
            <v-row class="ma-0" :align="'center'">
              <span>ເລືອກຄຸ້ມຄອງພະນັກງານ</span><v-spacer></v-spacer>
              <v-btn
                variant="text"
                size="x-small"
                icon=""
                color="error"
                class="ma-1"
                @click="addNewEmployeeModal = false"
              >
                <Icon name="ic:round-close" class="text-error" />
              </v-btn>
            </v-row>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="overflow-auto" style="max-height: 75vh">
            <div v-if="addNewEmployeeList.length <= 0" class="text-center">
              <no-data></no-data>
            </div>
            <div v-else class="mb-4">
              <v-row
                class="ma-0"
                :align="'start'"
                v-for="emp in addNewEmployeeList"
              >
                <div class="mb-2">
                  <div>
                    <v-avatar color="grey" size="80" class="mt-4">
                      <v-img :src="nuxtApp.$profilePath(emp?.PICTURE)" cover
                        ><template v-slot:placeholder>
                          <v-row
                            :align="'center'"
                            class="fill-height ma-0"
                            justify="center"
                          >
                            <v-progress-circular
                              color="grey-lighten-5"
                              indeterminate
                            ></v-progress-circular>
                          </v-row>
                        </template>
                        <template v-slot:error>
                          <v-img
                            cover
                            class="rounded-lg"
                            src="~/assets/img/profile.jpg"
                          ></v-img> </template
                      ></v-img>
                    </v-avatar>
                  </div>

                  <div class="text-center pt-2">
                    <p :class="'text-secondary'">
                      <b>{{ emp?.USER_NAME }}</b>
                    </p>
                  </div>
                </div>
                <v-col class="py-0">
                  <v-row class="ma-0" :align="'center'">
                    <v-col class="px-2">
                      <p>{{ emp?.FULL_NAME_LA }}</p>
                      <p>{{ emp?.FULL_NAME_EN }}</p>
                    </v-col>
                    <div>
                      <p
                        v-if="
                          employeeGroup.filter(
                            (el) =>
                              el.USER_NAME.toLowerCase() ==
                              emp.USER_NAME.toLowerCase()
                          ).length > 0
                        "
                        class="text-success"
                      >
                        (ເພີ່ມແລ້ວ)
                      </p>
                      <v-btn
                        v-else
                        variant="tonal"
                        size="small"
                        icon=""
                        color="success"
                        class="ma-1"
                        @click="onInsertEmployee(emp.USER_NAME)"
                      >
                        <Icon
                          name="mingcute:check-2-line"
                          class="text-success"
                        />
                      </v-btn>
                    </div>
                  </v-row>
                  <div>
                    <p>
                      <span class="text-secondary"
                        >{{ $t("positionLevel") }}:</span
                      >
                      {{ emp?.POS_NAME }}
                    </p>
                    <p>
                      <span class="text-secondary">{{ $t("position") }}:</span>
                      {{ emp?.POS_DESC }}
                    </p>
                    <p>
                      <span class="text-secondary">{{ $t("team") }}:</span>
                      {{ emp?.TEAM_NAME }}
                    </p>
                    <p>
                      <span class="text-secondary">{{ $t("section") }}:</span>
                      {{ emp?.SEC_NAME }}
                    </p>
                    <p>
                      <span class="text-secondary">{{ $t("branch") }}:</span>
                      {{ emp?.BR_NAME }}
                    </p>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <div class="w-100">
              <v-text-field
                v-model="txtSearchAddNewEmployee"
                color="text-secondary"
                variant="outlined"
                clearable
                density="comfortable"
                rounded="lg"
                :label="$t('UserName')"
                placeholder="CSE000,CSE000"
                @keyup.enter="onSearchAddNewEmployee"
              ></v-text-field>
              <v-btn
                color="primary"
                variant="flat"
                rounded="lg"
                class="w-100"
                @click="onSearchAddNewEmployee"
              >
                <Icon name="ic:sharp-search" class="text-white mr-1" />
                <span>{{ $t("Search") }}</span>
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-dialog>

  <!-- ADD NEW TEAM -->
  <v-dialog v-model="addNewTeamModal">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="0" rounded="lg">
          <v-card-title>
            <v-row class="ma-0" :align="'center'">
              <span>ເພີ່ມຂະແໜງ</span><v-spacer></v-spacer>
              <v-btn
                variant="text"
                size="x-small"
                icon=""
                color="error"
                class="ma-1"
                @click="addNewTeamModal = false"
              >
                <Icon name="ic:round-close" class="text-error" />
              </v-btn>
            </v-row>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="overflow-auto" :style="'max-height: 75vh;'">
            <div v-if="orgList.length <= 0" class="text-center">
              <no-data></no-data>
            </div>
            <div v-else class="mb-4">
              <v-list>
                <v-list-group
                  v-for="(branch, i) in orgList"
                  :value="branch.BRANCH_ID"
                  :key="branch.BRANCH_ID"
                  color="primary"
                  :isOpen="true"
                >
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-account-circle"
                      :title="branch.BR_NAME"
                      color="primary"
                    >
                    </v-list-item>
                  </template>

                  <v-list-group
                    v-for="(section, index) in branch.SECTION_LIST"
                    :key="section.SECTION_ID"
                    :value="branch.BRANCH_ID + '-' + section.SECTION_ID"
                  >
                    <template v-slot:activator="{ props }">
                      <v-list-item
                        prepend-icon="mdi-account-circle"
                        v-bind="props"
                        :title="section.SEC_NAME"
                        :value="branch.BRANCH_ID + '-' + section.SECTION_ID"
                        color="primary"
                      ></v-list-item>
                    </template>

                    <div class="pl-4">
                      <div
                        v-for="(team, idx) in section.TEAM_LIST"
                        :key="team.TEAM_ID"
                      >
                        <div
                          v-if="checkTeamInclude(team.TEAM_ID) == true"
                          class="pa-4"
                        >
                          <p>
                            {{ team.TEAM_NAME }}
                            <span class="ml-2 text-success">(ເພີ່ມແລ້ວ)</span>
                          </p>
                        </div>
                        <v-checkbox
                          v-else
                          v-model="addNewTeamSelected"
                          color="primary"
                          :label="team.TEAM_NAME"
                          :value="team.TEAM_ID"
                          hide-details
                        ></v-checkbox>
                      </div>
                    </div>
                  </v-list-group>
                </v-list-group>
              </v-list>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <div class="w-100">
              <v-btn
                color="primary"
                variant="flat"
                rounded="lg"
                class="w-100"
                @click="onInsertTeam()"
              >
                <Icon name="el:ok" class="text-white mr-1" />
                <span>{{ $t("OK") }} ({{ addNewTeamSelected.length }})</span>
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-dialog>

  <!-- ADD NEW SECTION -->
  <v-dialog v-model="addNewSectionModal">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="0" rounded="lg">
          <v-card-title>
            <v-row class="ma-0" :align="'center'">
              <span>ເພີ່ມຝ່າຍ</span><v-spacer></v-spacer>
              <v-btn
                variant="text"
                size="x-small"
                icon=""
                color="error"
                class="ma-1"
                @click="addNewSectionModal = false"
              >
                <Icon name="ic:round-close" class="text-error" />
              </v-btn>
            </v-row>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="overflow-auto" :style="'max-height: 75vh;'">
            <div v-if="orgList.length <= 0" class="text-center">
              <no-data></no-data>
            </div>
            <div v-else class="mb-4">
              <v-list>
                <v-list-group
                  v-for="(branch, i) in orgList"
                  :value="branch.BRANCH_ID"
                  :key="branch.BRANCH_ID"
                  color="primary"
                  :isOpen="true"
                >
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-account-circle"
                      :title="branch.BR_NAME"
                      color="primary"
                    >
                    </v-list-item>
                  </template>

                  <div class="pl-4">
                    <div
                      v-for="(sec, idx) in branch.SECTION_LIST"
                      :key="sec.SECTION_ID"
                    >
                      <div
                        v-if="checkSectionInclude(sec.SECTION_ID)"
                        class="pa-4"
                      >
                        <p>
                          {{ sec.SEC_NAME }}
                          <span class="ml-2 text-success">(ເພີ່ມແລ້ວ)</span>
                        </p>
                      </div>
                      <v-checkbox
                        v-else
                        v-model="addNewSectionSelected"
                        :color="'primary'"
                        :label="sec.SEC_NAME"
                        :value="sec.SECTION_ID"
                        hide-details
                      ></v-checkbox>
                    </div>
                  </div>
                </v-list-group>
              </v-list>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <div class="w-100">
              <v-btn
                color="primary"
                variant="flat"
                rounded="lg"
                class="w-100"
                @click="onInsertSection()"
              >
                <Icon name="el:ok" class="text-white mr-1" />
                <span>{{ $t("OK") }} ({{ addNewSectionSelected.length }})</span>
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-dialog>

  <!-- ADD NEW BRANCH -->
  <v-dialog v-model="addNewBranchModal">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="0" rounded="lg">
          <v-card-title>
            <v-row class="ma-0" :align="'center'">
              <span>ເພີ່ມບ່ອນເຮັດວຽກ</span><v-spacer></v-spacer>
              <v-btn
                variant="text"
                size="x-small"
                icon=""
                color="error"
                class="ma-1"
                @click="addNewBranchModal = false"
              >
                <Icon name="ic:round-close" class="text-error" />
              </v-btn>
            </v-row>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="overflow-auto" :style="'max-height: 75vh;'">
            <div v-if="orgList.length <= 0" class="text-center">
              <no-data></no-data>
            </div>
            <div v-else class="mb-4">
              <div class="pl-4">
                <div v-for="(branch, idx) in orgList" :key="branch.BRANCH_ID">
                  <div v-if="checkBranchInclude(branch.BRANCH_ID)" class="pa-4">
                    <p>
                      {{ branch.BR_NAME }}
                      <span class="ml-2 text-success">(ເພີ່ມແລ້ວ)</span>
                    </p>
                  </div>
                  <v-checkbox
                    v-else
                    v-model="addNewBranchSelected"
                    :color="'primary'"
                    :label="branch.BR_NAME"
                    :value="branch.BRANCH_ID"
                    hide-details
                  ></v-checkbox>
                </div>
              </div>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <div class="w-100">
              <v-btn
                color="primary"
                variant="flat"
                rounded="lg"
                class="w-100"
                @click="onInsertBranch()"
              >
                <Icon name="el:ok" class="text-white mr-1" />
                <span>{{ $t("OK") }} ({{ addNewBranchSelected.length }})</span>
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-dialog>

  <v-dialog v-model="orgEmployeeModal">
    <v-row justify="center">
      <v-col cols="12" lg="10">
        <v-card elevation="0" rounded="lg">
          <v-card-title>
            <v-row class="ma-0" :align="'center'">
              <span>ໂຄງຮ່າງຄຸ້ມຄອງພະນັກງານ ({{ orgEmployeeList.length }})</span
              ><v-spacer></v-spacer>
              <v-btn
                variant="text"
                size="x-small"
                icon=""
                color="error"
                class="ma-1"
                @click="orgEmployeeModal = false"
              >
                <Icon name="ic:round-close" class="text-error" />
              </v-btn>
            </v-row>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text
            class="overflow-auto app-bg"
            :style="'max-height: 85vh;'"
          >
            <div v-if="orgEmployeeList.length <= 0" class="text-center">
              <no-data></no-data>
            </div>
            <div v-else class="mb-4">
              <!-- {{ orgEmployeeList }} -->
              <v-card
                v-for="emp in orgEmployeeList"
                rounded="lg"
                elevation="0"
                class="my-2"
                :color="
                  emp.USER_NAME.toUpperCase() == orgUserSeleted?.USER_NAME
                    ? 'green-lighten-4'
                    : ''
                "
              >
                <v-card-text>
                  <v-row :align="'center'" justify="center">
                    <v-avatar color="grey" size="50" class="ma-2">
                      <v-img :src="nuxtApp.$profilePath(emp?.PICTURE)" cover
                        ><template v-slot:placeholder>
                          <v-row
                            :align="'center'"
                            class="fill-height ma-0"
                            justify="center"
                          >
                            <v-progress-circular
                              color="grey-lighten-5"
                              indeterminate
                            ></v-progress-circular>
                          </v-row>
                        </template>
                        <template v-slot:error>
                          <v-img
                            cover
                            class="rounded-lg"
                            src="~/assets/img/profile.jpg"
                          ></v-img> </template
                      ></v-img>
                    </v-avatar>
                    <v-col cols="12" md="3" class="text-center py-1">
                      <p>{{ emp.FULL_NAME_LA }}</p>
                      <p class="text-secondary">{{ emp.FULL_NAME_EN }}</p>
                    </v-col>
                    <v-col cols="12" md="3" class="text-center py-0">
                      <p>{{ emp.POS_NAME }}</p>
                      <p class="text-secondary">{{ emp.POS_DESC }}</p>
                    </v-col>
                    <v-col cols="12" md="3" class="text-center py-0">
                      <p>{{ emp.TEAM_NAME }}</p>
                      <p>{{ emp.SEC_NAME }}</p>
                      <p>{{ emp.BR_NAME }}</p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-dialog>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "custom",
  middleware: ["auth"],
});

const nuxtApp: any = useNuxtApp();
const route: any = useRoute();

const loginStore = useLoginStore();
const orgStore = useOrgStore();
const employeeStore = useEmployeeStore();
const utilStore = useUtilStore();

const orgUserSeleted = ref<EmployeeModel>();
const branchGroup: any = ref([]);
const sectionGroup = ref<any>([]);
const teamGroup = ref<any>([]);

const positionGroup = ref<PositionModel[]>([]);
const employeeGroup = ref<EmployeeModel[]>([]);
const orgList = ref<any>([]);

onMounted(async () => {
  await orgStore.acGetOrganizationList({});
  orgList.value = orgStore.getOrgList;
  await onLoadOrgManagementDetail(route.params.user);
});

const onLoadOrgManagementDetail = async (user: string | null) => {
  nuxtApp.$openLoading();
  branchGroup.value = [];
  sectionGroup.value = [];
  teamGroup.value = [];
  positionGroup.value = [];
  employeeGroup.value = [];

  //CLOSE MODAL ADD NEW
  addNewPositionModal.value = false;
  addNewEmployeeModal.value = false;
  addNewTeamModal.value = false;
  addNewSectionModal.value = false;
  addNewBranchModal.value = false;

  addNewPositionSelected.value = [];
  addNewTeamSelected.value = [];
  addNewSectionSelected.value = [];
  addNewBranchSelected.value = [];

  await employeeStore.acGetEmployeeList({
    user: user,
  });

  var a = employeeStore.getEmployeeList;
  if (a.length > 0) {
    orgUserSeleted.value = a[0];
  } else {
    nuxtApp.$openAlert("E", "No data found").then(async (r: any) => {
      nuxtApp.$router.back();
    });
    nuxtApp.$closeLoading();
    return;
  }

  await orgStore.acGetOrgManagementDetail({
    user_name: user,
  });
  if (orgStore.getOrgManagementDetail.length <= 0) {
    nuxtApp.$closeLoading();
    return;
  }

  //LOAD BRANCH
  var branchCode: any = [];
  var sectionId: any = [];
  var teamId: any = [];
  var pospId: any = [];
  var empUserName: any = [];
  orgStore.getOrgManagementDetail.map(function (
    item: OrgManagementDetailModel
  ) {
    if (item.BR_CODE) {
      branchCode = branchCode.filter((el: any) => el != item.BR_CODE);
      branchCode.push(item.BR_CODE);
    }
    if (item.SECTION_ID) {
      sectionId = sectionId.filter((el: any) => el != item.SECTION_ID);
      sectionId.push(item.SECTION_ID);
    }
    if (item.TEAM_ID) {
      teamId = teamId.filter((el: any) => el != item.TEAM_ID);
      teamId.push(item.TEAM_ID);
    }
    if (item.POS_ID) {
      pospId = pospId.filter((el: any) => el != item.POS_ID);
      pospId.push(item.POS_ID);
    }
    if (item.SP_USER) {
      empUserName = empUserName.filter((el: any) => el != item.SP_USER);
      empUserName.push(item.SP_USER);
    }
  });
  //LOAD BRANCH
  if (branchCode.length > 0) {
    await onLoadBrnach(branchCode);
  }
  //LOAD SETION
  if (sectionId.length > 0) {
    await onLoadSection(sectionId);

    // await orgStore.acGetSectionList({ section_id: sectionId.toString() });
    // sectionGroup.value = orgStore.getSectionList;
  }
  //LOAD TEAM
  if (teamId.length > 0) {
    await onLoadTeam(teamId);
    // await orgStore.acGetTeamList({ team_id: teamId.toString() });
    // teamGroup.value = orgStore.getTeamList;
  }

  //LOAD POSITION
  if (pospId.length > 0) {
    await orgStore.acGetPositionList({ pos_id: pospId.toString() });
    positionGroup.value = orgStore.getPositionList;
  }

  //LOAD EMPLOYEE
  if (empUserName.length > 0) {
    await employeeStore.acGetEmployeeList({ user: empUserName.toString() });
    employeeGroup.value = employeeStore.getEmployeeList;
  }
  nuxtApp.$closeLoading();
};

const onLoadBrnach = async (branchCode: any) => {
  branchGroup.value = [];
  for (let i = 0; i < branchCode.length; i++) {
    const element = branchCode[i];
    orgStore.getOrgList
      .filter((br: any) => br.BR_CODE.toLowerCase() == element.toLowerCase())
      .forEach((el: any) => {
        // delete el.SECTION_LIST;
        branchGroup.value.push(el);
      });
  }
};

const onLoadSection = async (sectionId: any) => {
  sectionGroup.value = [];
  orgStore.getOrgList.filter(async (br: any) => {
    var a = {
      BRANCH_ID: br.BRANCH_ID,
      BR_CODE: br.BR_CODE,
      BR_NAME: br.BR_NAME,
      SECTION_LIST: [] as any,
    };
    for (let i = 0; i < sectionId.length; i++) {
      const element = sectionId[i];

      await br.SECTION_LIST.filter(
        (sec: any) => sec.SECTION_ID == element
      ).forEach((el: any) => {
        a.SECTION_LIST.push({
          SECTION_ID: el.SECTION_ID,
          SEC_NAME: el.SEC_NAME,
          SEC_NAME_EN: el.SEC_NAME_EN,
        });
      });
    }
    if (a.SECTION_LIST.length > 0) {
      sectionGroup.value.push(a);
    }
  });
};

const onLoadTeam = async (teamId: any) => {
  teamGroup.value = [];
  orgStore.getOrgList.filter(async (br: any) => {
    var a = {
      BRANCH_ID: br.BRANCH_ID,
      BR_CODE: br.BR_CODE,
      BR_NAME: br.BR_NAME,
      SECTION_LIST: [] as any,
    };

    await br.SECTION_LIST.filter((sec: any) => {
      var b = {
        SECTION_ID: sec.SECTION_ID,
        SEC_NAME: sec.SEC_NAME,
        SEC_NAME_EN: sec.SEC_NAME_EN,
        TEAM_LIST: [] as any,
      };
      for (let i = 0; i < teamId.length; i++) {
        const element = teamId[i];
        sec.TEAM_LIST.filter((team: any) => team.TEAM_ID == element).forEach(
          (el: any) => {
            b.TEAM_LIST.push({
              TEAM_ID: el.TEAM_ID,
              TEAM_NAME: el.TEAM_NAME,
            });
          }
        );
      }
      if (b.TEAM_LIST.length > 0) {
        a.SECTION_LIST.push(b);
        teamGroup.value.push(a);
      }
    });
  });
};

// SEARCH EMPLOYEE
const searchEmployeeModal = ref(false);
const txtSearchUserName = ref("");
const employeeSearchList = ref<EmployeeModel[]>([]);

const onSearchEmployee = async () => {
  nuxtApp.$openLoading();
  await employeeStore.acGetEmployeeList({
    user: txtSearchUserName.value,
  });
  employeeSearchList.value = employeeStore.getEmployeeList;
  nuxtApp.$closeLoading();
};

const onSelectEmployeeSearch = async (item: EmployeeModel) => {
  //   await onLoadOrgManagementDetail(item.USER_NAME);
  //   searchEmployeeModal.value = false;
  nuxtApp.$router.push("/manage/employee/details/" + item.USER_NAME, {
    replace: true,
  });
};

// ADD  POSITION
const addNewPositionModal = ref(false);
const addNewPositionSelected = ref<PositionModel[]>([]);
const addNewPositionList = ref<PositionModel[]>([]);

//POSITION
const onOpenAddNewPositionModal = async () => {
  await orgStore.acGetPositionList({});
  addNewPositionList.value = orgStore.getPositionList;
  addNewPositionModal.value = true;
};

const onInsertPosition = async () => {
  nuxtApp.$openLoading();
  for (let i = 0; i < addNewPositionSelected.value.length; i++) {
    const element = addNewPositionSelected.value[i];
    const body = {
      id: "",
      user_name: orgUserSeleted.value?.USER_NAME,
      branch_id: "",
      section_id: "",
      team_id: "",
      pos_id: element,
      spacial_user: "",
      create_user: loginStore.loginUser?.USER_NAME,
      action: utilStore.getActnoCode.INSERT,
    };
    await orgStore
      .acInsertOrgManagement(body)
      .then(async (result: ResponseModel) => {
        nuxtApp.$closeLoading();
        if (result.ERROR_CODE == "00") {
          if (i >= addNewPositionSelected.value.length - 1) {
            nuxtApp.$closeLoading();
            nuxtApp
              .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
              .then(async (r: any) => {
                addNewPositionModal.value = false;
                await onLoadOrgManagementDetail(route.params.user);
              });
          }
        } else {
          i = addNewPositionSelected.value.length;
          nuxtApp.$closeLoading();
          nuxtApp.$openAlert("E", result.ERROR_CODE + ": " + result.ERROR_DESC);
          return;
        }
      });
  }
};

const onDeletePosition = async (pos_id: number) => {
  nuxtApp
    .$openAlert("Q", nuxtApp.$t("AreYouSureToDelete"))
    .then(async (r: any) => {
      var id: any = orgStore.getOrgManagementDetail.filter(
        (el) =>
          el.POS_ID == pos_id &&
          el.USER_NAME.toLowerCase() ==
            orgUserSeleted.value?.USER_NAME.toLowerCase()
      );
      if (id.length <= 0) {
        nuxtApp.$openAlert("E", "No data found");
        return;
      }
      const body = {
        id: id[0].ID,
        action: utilStore.getActnoCode.DELETE,
      };
      nuxtApp.$openLoading();
      await orgStore
        .acInsertOrgManagement(body)
        .then(async (result: ResponseModel) => {
          if (result.ERROR_CODE == "00") {
            nuxtApp.$closeLoading();
            nuxtApp
              .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
              .then(async (r: any) => {
                await onLoadOrgManagementDetail(route.params.user);
              });
          } else {
            nuxtApp.$closeLoading();
            nuxtApp.$openAlert(
              "E",
              result.ERROR_CODE + ": " + result.ERROR_DESC
            );
            return;
          }
        });
    })
    .catch((c: any) => {});
};

//EMPLOYEE

// ADD  EMPLOYEE
const addNewEmployeeModal = ref(false);
const addNewEmployeeList = ref<EmployeeModel[]>([]);
const txtSearchAddNewEmployee = ref("");

const onSearchAddNewEmployee = async () => {
  await employeeStore.acGetEmployeeList({
    user: txtSearchAddNewEmployee.value,
  });
  addNewEmployeeList.value = employeeStore.getEmployeeList;
};

const onInsertEmployee = async (userName: string) => {
  const body = {
    id: "",
    user_name: orgUserSeleted.value?.USER_NAME,
    branch_id: "",
    section_id: "",
    team_id: "",
    pos_id: "",
    spacial_user: userName,
    create_user: loginStore.loginUser?.USER_NAME,
    action: utilStore.getActnoCode.INSERT,
  };
  nuxtApp.$openLoading();
  await orgStore
    .acInsertOrgManagement(body)
    .then(async (result: ResponseModel) => {
      if (result.ERROR_CODE == "00") {
        nuxtApp.$closeLoading();
        nuxtApp
          .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
          .then(async (r: any) => {
            await onLoadOrgManagementDetail(route.params.user);
          });
      } else {
        nuxtApp.$closeLoading();
        nuxtApp.$openAlert("E", result.ERROR_CODE + ": " + result.ERROR_DESC);
        return;
      }
    });
};

const onDeleteEmployee = async (userName: string) => {
  nuxtApp
    .$openAlert("Q", nuxtApp.$t("AreYouSureToDelete"))
    .then(async (r: any) => {
      var id: any = orgStore.getOrgManagementDetail.filter(
        (el) =>
          el.SP_USER == userName &&
          el.USER_NAME.toLowerCase() ==
            orgUserSeleted.value?.USER_NAME.toLowerCase()
      );
      if (id.length <= 0) {
        nuxtApp.$openAlert("E", "No data found");
        return;
      }

      const body = {
        id: id[0].ID,
        action: utilStore.getActnoCode.DELETE,
      };
      nuxtApp.$openLoading();
      await orgStore
        .acInsertOrgManagement(body)
        .then(async (result: ResponseModel) => {
          if (result.ERROR_CODE == "00") {
            nuxtApp.$closeLoading();
            nuxtApp
              .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
              .then(async (r: any) => {
                await onLoadOrgManagementDetail(route.params.user);
              });
          } else {
            nuxtApp.$closeLoading();
            nuxtApp.$openAlert(
              "E",
              result.ERROR_CODE + ": " + result.ERROR_DESC
            );
            return;
          }
        });
    })
    .catch((c: any) => {});
};

//TEAM

// ADD  TEAM
const addNewTeamModal = ref(false);
const addNewTeamSelected = ref<TeamModel[]>([]);

const checkTeamInclude: any = (team_id: number) => {
  var a = orgStore.getOrgManagementDetail.filter(
    (t: any) => t.TEAM_ID && t.TEAM_ID.toString() == team_id.toString()
  );

  return a.length > 0 ? true : false;
};

const onInsertTeam = async () => {
  nuxtApp.$openLoading();
  for (let i = 0; i < addNewTeamSelected.value.length; i++) {
    const element = addNewTeamSelected.value[i];
    const body = {
      id: "",
      user_name: orgUserSeleted.value?.USER_NAME,
      branch_id: "",
      section_id: "",
      team_id: element,
      pos_id: "",
      spacial_user: "",
      create_user: loginStore.loginUser?.USER_NAME,
      action: utilStore.getActnoCode.INSERT,
    };

    await orgStore
      .acInsertOrgManagement(body)
      .then(async (result: ResponseModel) => {
        if (result.ERROR_CODE == "00") {
          if (i >= addNewTeamSelected.value.length - 1) {
            nuxtApp.$closeLoading();
            nuxtApp
              .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
              .then(async (r: any) => {
                addNewPositionModal.value = false;
                await onLoadOrgManagementDetail(route.params.user);
              });
          }
        } else {
          i = addNewTeamSelected.value.length;
          nuxtApp.$closeLoading();
          nuxtApp.$openAlert("E", result.ERROR_CODE + ": " + result.ERROR_DESC);
          return;
        }
      });
  }
};

const onDeleteTeam = async (team_id: number) => {
  nuxtApp
    .$openAlert("Q", nuxtApp.$t("AreYouSureToDelete"))
    .then(async (r: any) => {
      var id: any = orgStore.getOrgManagementDetail.filter(
        (el) =>
          el.TEAM_ID == team_id &&
          el.USER_NAME.toLowerCase() ==
            orgUserSeleted.value?.USER_NAME.toLowerCase()
      );
      if (id.length <= 0) {
        nuxtApp.$openAlert("E", "No data found");
        return;
      }
      const body = {
        id: id[0].ID,
        action: utilStore.getActnoCode.DELETE,
      };
      nuxtApp.$openLoading();
      await orgStore
        .acInsertOrgManagement(body)
        .then(async (result: ResponseModel) => {
          if (result.ERROR_CODE == "00") {
            nuxtApp.$closeLoading();
            nuxtApp
              .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
              .then(async (r: any) => {
                await onLoadOrgManagementDetail(route.params.user);
              });
          } else {
            nuxtApp.$closeLoading();
            nuxtApp.$openAlert(
              "E",
              result.ERROR_CODE + ": " + result.ERROR_DESC
            );
            return;
          }
        });
    })
    .catch((c: any) => {});
};

//SECTION

// ADD  SECTION
const addNewSectionModal = ref(false);
const addNewSectionSelected = ref<SectionModel[]>([]);

const checkSectionInclude: any = (section_id: number) => {
  var a = orgStore.getOrgManagementDetail.filter(
    (t: any) => t.SECTION_ID && t.SECTION_ID.toString() == section_id.toString()
  );

  return a.length > 0 ? true : false;
};

const onInsertSection = async () => {
  nuxtApp.$openLoading();
  for (let i = 0; i < addNewSectionSelected.value.length; i++) {
    const element = addNewSectionSelected.value[i];
    const body = {
      id: "",
      user_name: orgUserSeleted.value?.USER_NAME,
      branch_id: "",
      section_id: element,
      team_id: "",
      pos_id: "",
      spacial_user: "",
      create_user: loginStore.loginUser?.USER_NAME,
      action: utilStore.getActnoCode.INSERT,
    };
    await orgStore
      .acInsertOrgManagement(body)
      .then(async (result: ResponseModel) => {
        if (result.ERROR_CODE == "00") {
          if (i >= addNewSectionSelected.value.length - 1) {
            nuxtApp.$closeLoading();
            nuxtApp
              .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
              .then(async (r: any) => {
                addNewPositionModal.value = false;
                await onLoadOrgManagementDetail(route.params.user);
              });
          }
        } else {
          i = addNewTeamSelected.value.length;
          nuxtApp.$closeLoading();
          nuxtApp.$openAlert("E", result.ERROR_CODE + ": " + result.ERROR_DESC);
          return;
        }
      });
  }
};

const onDeleteSection = async (section_id: number) => {
  nuxtApp
    .$openAlert("Q", nuxtApp.$t("AreYouSureToDelete"))
    .then(async (r: any) => {
      var id: any = orgStore.getOrgManagementDetail.filter(
        (el) =>
          el.SECTION_ID == section_id &&
          el.USER_NAME.toLowerCase() ==
            orgUserSeleted.value?.USER_NAME.toLowerCase()
      );
      if (id.length <= 0) {
        nuxtApp.$openAlert("E", "No data found");
        return;
      }
      const body = {
        id: id[0].ID,
        action: utilStore.getActnoCode.DELETE,
      };
      nuxtApp.$openLoading();
      await orgStore
        .acInsertOrgManagement(body)
        .then(async (result: ResponseModel) => {
          if (result.ERROR_CODE == "00") {
            nuxtApp.$closeLoading();
            nuxtApp
              .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
              .then(async (r: any) => {
                await onLoadOrgManagementDetail(route.params.user);
              });
          } else {
            nuxtApp.$closeLoading();
            nuxtApp.$openAlert(
              "E",
              result.ERROR_CODE + ": " + result.ERROR_DESC
            );
            return;
          }
        });
    })
    .catch((c: any) => {});
};

//BRANCH
// ADD  BRANCH
const addNewBranchModal = ref(false);
const addNewBranchSelected = ref<BranchModel[]>([]);

const checkBranchInclude: any = (branch_id: number) => {
  var a = orgStore.getOrgManagementDetail.filter(
    (t: any) => t.BRANCH_ID && t.BRANCH_ID.toString() == branch_id.toString()
  );
  return a.length > 0 ? true : false;
};

const onInsertBranch = async () => {
  nuxtApp.$openLoading();
  for (let i = 0; i < addNewBranchSelected.value.length; i++) {
    const element = addNewBranchSelected.value[i];
    const body = {
      id: "",
      user_name: orgUserSeleted.value?.USER_NAME,
      branch_id: element,
      section_id: "",
      team_id: "",
      pos_id: "",
      spacial_user: "",
      create_user: loginStore.loginUser?.USER_NAME,
      action: utilStore.getActnoCode.INSERT,
    };
    await orgStore
      .acInsertOrgManagement(body)
      .then(async (result: ResponseModel) => {
        if (result.ERROR_CODE == "00") {
          if (i >= addNewBranchSelected.value.length - 1) {
            nuxtApp.$closeLoading();
            nuxtApp
              .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
              .then(async (r: any) => {
                addNewPositionModal.value = false;
                await onLoadOrgManagementDetail(route.params.user);
              });
          }
        } else {
          i = addNewTeamSelected.value.length;
          nuxtApp.$closeLoading();
          nuxtApp.$openAlert("E", result.ERROR_CODE + ": " + result.ERROR_DESC);
          return;
        }
      });
  }
};

const onDeleteBranch = async (branch_id: number) => {
  nuxtApp
    .$openAlert("Q", nuxtApp.$t("AreYouSureToDelete"))
    .then(async (r: any) => {
      var id: any = orgStore.getOrgManagementDetail.filter(
        (el) =>
          el.BRANCH_ID == branch_id &&
          el.USER_NAME.toLowerCase() ==
            orgUserSeleted.value?.USER_NAME.toLowerCase()
      );
      if (id.length <= 0) {
        nuxtApp.$openAlert("E", "No data found");
        return;
      }
      const body = {
        id: id[0].ID,
        action: utilStore.getActnoCode.DELETE,
      };
      nuxtApp.$openLoading();
      await orgStore
        .acInsertOrgManagement(body)
        .then(async (result: ResponseModel) => {
          nuxtApp.$closeLoading();
          if (result.ERROR_CODE == "00") {
            nuxtApp.$closeLoading();
            nuxtApp
              .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
              .then(async (r: any) => {
                await onLoadOrgManagementDetail(route.params.user);
              });
          } else {
            nuxtApp.$closeLoading();
            nuxtApp.$openAlert(
              "E",
              result.ERROR_CODE + ": " + result.ERROR_DESC
            );
            return;
          }
        });
    })
    .catch((c: any) => {});
};

//VIEW ORG
const orgEmployeeModal = ref(false);
const orgEmployeeList = ref<EmployeeModel[]>([]);

const viewOrganization = async (type: String) => {
  nuxtApp.$openLoading();
  await orgStore.acGetOrgManagementGroup({
    user_name: orgUserSeleted.value?.USER_NAME,
    type: type,
  });
  orgEmployeeList.value = orgStore.getOrgManagementGroup;

  orgEmployeeModal.value = true;
  nuxtApp.$closeLoading();
};
</script>
