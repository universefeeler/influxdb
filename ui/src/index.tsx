import 'babel-polyfill'

import React, {PureComponent} from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {Router, Route, useRouterHistory, IndexRoute} from 'react-router'
import {createHistory, History} from 'history'

import configureStore from 'src/store/configureStore'
import {loadLocalStorage} from 'src/localStorage'

import {getRootNode} from 'src/utils/nodes'
import {getBasepath} from 'src/utils/basepath'

// Components
import App from 'src/App'
import GetOrganizations from 'src/shared/containers/GetOrganizations'
import Setup from 'src/Setup'
import Signin from 'src/Signin'
import SigninPage from 'src/onboarding/containers/SigninPage'
import Logout from 'src/Logout'
import TaskPage from 'src/tasks/containers/TaskPage'
import TasksPage from 'src/tasks/containers/TasksPage'
import TaskRunsPage from 'src/tasks/components/TaskRunsPage'
import OrganizationsIndex from 'src/organizations/containers/OrganizationsIndex'
import OrgTaskPage from 'src/organizations/components/OrgTaskPage'
import OrgTaskEditPage from 'src/organizations/components/OrgTaskEditPage'
import OrgBucketIndex from 'src/organizations/containers/OrgBucketsIndex'
import TaskEditPage from 'src/tasks/containers/TaskEditPage'
import DashboardPage from 'src/dashboards/components/DashboardPage'
import DashboardsIndex from 'src/dashboards/components/dashboard_index/DashboardsIndex'
import DashboardExportOverlay from 'src/dashboards/components/DashboardExportOverlay'
import DashboardImportOverlay from 'src/dashboards/components/DashboardImportOverlay'
import DataExplorerPage from 'src/dataExplorer/components/DataExplorerPage'
import SaveAsOverlay from 'src/dataExplorer/components/SaveAsOverlay'
import {MePage, Account} from 'src/me'
import NotFound from 'src/shared/components/NotFound'
import GetLinks from 'src/shared/containers/GetLinks'
import GetMe from 'src/shared/containers/GetMe'
import Notifications from 'src/shared/containers/Notifications'
import ConfigurationPage from 'src/configuration/components/ConfigurationPage'
import OrgDashboardsIndex from 'src/organizations/containers/OrgDashboardsIndex'
import OrgMembersIndex from 'src/organizations/containers/OrgMembersIndex'
import OrgTelegrafsIndex from 'src/organizations/containers/OrgTelegrafsIndex'
import OrgVariablesIndex from 'src/organizations/containers/OrgVariablesIndex'
import OrgScrapersIndex from 'src/organizations/containers/OrgScrapersIndex'
import OrgTasksIndex from 'src/organizations/containers/OrgTasksIndex'
import TaskExportOverlay from 'src/organizations/components/TaskExportOverlay'
import TaskImportOverlay from 'src/organizations/components/TaskImportOverlay'
import VEO from 'src/dashboards/components/VEO'
import NoteEditorOverlay from 'src/dashboards/components/NoteEditorOverlay'
import OrgTemplatesIndex from 'src/organizations/containers/OrgTemplatesIndex'
import TemplateExportOverlay from 'src/templates/components/TemplateExportOverlay'
import TemplateImportOverlay from 'src/templates/components/TemplateImportOverlay'

import OnboardingWizardPage from 'src/onboarding/containers/OnboardingWizardPage'

// Actions
import {disablePresentationMode} from 'src/shared/actions/app'

// Styles
import 'src/style/chronograf.scss'
import '@influxdata/clockface/dist/index.css'

const rootNode = getRootNode()
const basepath = getBasepath()

declare global {
  interface Window {
    basepath: string
  }
}

// Older method used for pre-IE 11 compatibility
window.basepath = basepath

const history: History = useRouterHistory(createHistory)({
  basename: basepath, // this is written in when available by the URL prefixer middleware
})

const store = configureStore(loadLocalStorage(), history)
const {dispatch} = store

history.listen(() => {
  dispatch(disablePresentationMode())
})

window.addEventListener('keyup', event => {
  const escapeKeyCode = 27
  // fallback for browsers that don't support event.key
  if (event.key === 'Escape' || event.keyCode === escapeKeyCode) {
    dispatch(disablePresentationMode())
  }
})

class Root extends PureComponent {
  public render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route component={GetLinks}>
            <Route component={Setup}>
              <Route path="/onboarding">
                <Route path=":stepID" component={OnboardingWizardPage} />
                <Route
                  path=":stepID/:substepID"
                  component={OnboardingWizardPage}
                />
                <Route component={Notifications}>
                  <Route path="/signin" component={SigninPage} />
                  <Route path="/logout" component={Logout} />
                </Route>
              </Route>
              <Route path="/">
                <Route component={Signin}>
                  <Route component={GetMe}>
                    <Route component={GetOrganizations}>
                      <Route component={App}>
                        <IndexRoute component={MePage} />
                        <Route path="organizations">
                          <IndexRoute component={OrganizationsIndex} />
                          <Route path=":orgID">
                            <Route path="buckets" component={OrgBucketIndex} />
                            <Route
                              path="dashboards"
                              component={OrgDashboardsIndex}
                            >
                              <Route
                                path=":dashboardID/export"
                                component={DashboardExportOverlay}
                              />
                              <Route
                                path="import"
                                component={DashboardImportOverlay}
                              />
                            </Route>
                            <Route path="members" component={OrgMembersIndex} />
                            <Route
                              path="telegrafs"
                              component={OrgTelegrafsIndex}
                            />
                            <Route
                              path="templates"
                              component={OrgTemplatesIndex}
                            >
                              <Route
                                path="import"
                                component={TemplateImportOverlay}
                              />
                              <Route
                                path=":id/export"
                                component={TemplateExportOverlay}
                              />
                            </Route>
                            <Route
                              path="variables"
                              component={OrgVariablesIndex}
                            />
                            <Route
                              path="scrapers"
                              component={OrgScrapersIndex}
                            />
                            <Route path="tasks">
                              <IndexRoute component={OrgTasksIndex}>
                                <Route
                                  path="import"
                                  component={TaskImportOverlay}
                                />
                                <Route
                                  path=":id/export"
                                  component={TaskExportOverlay}
                                />
                              </IndexRoute>
                              <Route path="new" component={OrgTaskPage} />
                              <Route path=":id" component={OrgTaskEditPage} />
                            </Route>
                          </Route>
                        </Route>
                        <Route path="tasks" component={TasksPage}>
                          <Route
                            path=":id/export"
                            component={TaskExportOverlay}
                          />
                          <Route path="import" component={TaskImportOverlay} />
                        </Route>
                        <Route path="tasks/:id/runs" component={TaskRunsPage} />
                        <Route path="tasks/new" component={TaskPage} />
                        <Route path="tasks/:id" component={TaskEditPage} />
                        <Route
                          path="data-explorer"
                          component={DataExplorerPage}
                        >
                          <Route path="save" component={SaveAsOverlay} />
                        </Route>
                        <Route path="dashboards">
                          <IndexRoute component={DashboardsIndex} />
                          <Route path=":dashboardID" component={DashboardPage}>
                            <Route path="cells">
                              <Route path="new" component={VEO} />
                              <Route path=":cellID/edit" component={VEO} />
                            </Route>
                            <Route path="notes">
                              <Route path="new" component={NoteEditorOverlay} />
                              <Route
                                path=":cellID/edit"
                                component={NoteEditorOverlay}
                              />
                            </Route>
                          </Route>
                          <Route
                            path=":dashboardID/export"
                            component={DashboardExportOverlay}
                          />
                          <Route
                            path="import"
                            component={DashboardImportOverlay}
                          />
                        </Route>
                        <Route path="me" component={MePage} />
                        <Route path="account/:tab" component={Account} />
                        <Route
                          path="configuration/:tab"
                          component={ConfigurationPage}
                        />
                      </Route>
                    </Route>
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path="*" component={NotFound} />
        </Router>
      </Provider>
    )
  }
}

if (rootNode) {
  render(<Root />, rootNode)
}
