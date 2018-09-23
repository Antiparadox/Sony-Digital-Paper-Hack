var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Explorer;
        (function (Explorer) {
            var viewStatus = DPMW.View.Explorer.Status.viewStatus;
            var fetchHandler = DPMW.View.Explorer.Handler.fetchHandler;
            var ExplorerSearchStatusView = (function (_super) {
                __extends(ExplorerSearchStatusView, _super);
                function ExplorerSearchStatusView(options) {
                    _super.call(this, options);
                    this.newFolderButtonTabIndex = 301;
                    this.currentCollection_ = null;
                }
                ExplorerSearchStatusView.prototype.initialize = function (options) {
                    var _this = this;
                    var me = this;
                    $.get('../templates/explorer_searchstatusrview.html', function (data) {
                        _this.$el.html(data);
                        _this.newFolderButton = $('#new-folder-button');
                        _this.searchBarClose = $('#search-bar-close');
                        _this.$el.localize();
                        _this.searchBarKeyword = _this.$('#search-bar-keyword');
                        _this.listenTo(viewStatus, 'viewTypeChanged', _this.onViewTypeChanged);
                        _this.listenTo(viewStatus, 'searchTargetChanged', _this.onSearchTargetChanged);
                        _this.$el.hide();
                        _this.$('search-bar-waitting-icon').show();
                    }, 'html');
                    this.listenTo(this, 'resize', this.onWindowResize);
                    this.listenTo(this, "keydown", function (e) {
                        e.stopPropagation();
                        var activeElement = document.activeElement;
                        var activeElementId = activeElement.id;
                        var activeElementTabindex = $(activeElement).attr('tabIndex');
                        var code = e.which;
                        switch (code) {
                            case 32:
                            case 13:
                                me.enterKeyOnButton(activeElementId, e);
                                break;
                            default:
                                break;
                        }
                    });
                };
                ExplorerSearchStatusView.prototype.events = function () {
                    return {
                        "click #search-bar-close": "hideSearchStatusBar",
                    };
                };
                ExplorerSearchStatusView.prototype.enterKeyOnButton = function (activeElementId, event) {
                    var me = this;
                    switch (activeElementId) {
                        case 'search-bar-close':
                            me.hideSearchStatusBar();
                            break;
                        default:
                            break;
                    }
                };
                ExplorerSearchStatusView.prototype.getTextWidth = function (str) {
                    var element = $('#ruler');
                    if (element.length <= 0) {
                        console.warn('invalid status.');
                        return null;
                    }
                    var width = element.text(str).width();
                    element.empty();
                    return width;
                };
                ExplorerSearchStatusView.prototype.onWindowResize = function (event) {
                    if (viewStatus.getSearchTarget() === null ||
                        viewStatus.getSearchTarget().target === null ||
                        _.isEmpty(this.searchBarKeyword.text()) ||
                        _.isUndefined(this.$('#search-bar')[0])) {
                        return;
                    }
                    if (viewStatus.getSearchTarget().target === 'document_meta' ||
                        viewStatus.getSearchTarget().target === 'document_body') {
                        if ($('#search-bar').length <= 0 ||
                            $('.search-bar-item').length <= 0 ||
                            $('.search-bar-img-box').length <= 0 ||
                            $('.search-bar-close-div').length <= 0) {
                            console.warn('invalid status.');
                            return;
                        }
                        var keyWord = this.searchBarKeyword.text();
                        var strWidth = this.getTextWidth(keyWord);
                        if (typeof strWidth !== 'number') {
                            return;
                        }
                        var max = $('#search-bar').width() -
                            $('.search-bar-item').width() -
                            $('.search-bar-img-box').width() -
                            $('.search-bar-close-div').width();
                        var len = keyWord.length;
                        var idx = len;
                        var text = "";
                        var prefix = $.i18n.t('content.navi.abbrev');
                        max = max - 30;
                        if (max < 0 || strWidth < 0) {
                            console.warn('invalid status.');
                            return;
                        }
                        if (strWidth > max) {
                            while (strWidth > max) {
                                if (idx <= 0) {
                                    break;
                                }
                                text = keyWord.substring(0, idx);
                                strWidth = this.getTextWidth(text + prefix);
                                if (typeof strWidth !== 'number') {
                                    return;
                                }
                                idx--;
                            }
                            this.searchBarKeyword.text(text + prefix);
                        }
                        else {
                            this.searchBarKeyword.text(viewStatus.getSearchTarget().keyword);
                        }
                    }
                };
                ExplorerSearchStatusView.prototype.onSearchTargetChanged = function () {
                    if (viewStatus.getSearchTarget().target === 'document_meta' ||
                        viewStatus.getSearchTarget().target === 'document_body') {
                        var keyWord = viewStatus.getSearchTarget().keyword;
                        var strWidth = this.getTextWidth(keyWord);
                        if (typeof strWidth !== 'number') {
                            return;
                        }
                        this.searchBarKeyword.css('visibility', '');
                        this.searchBarKeyword.css('margin-left', '8px');
                        $('#search-bar-img').css('visibility', 'hidden');
                        if ($('#search-bar').length <= 0 ||
                            $('.search-bar-item').length <= 0 ||
                            $('.search-bar-img-box').length <= 0 ||
                            $('.search-bar-close-div').length <= 0) {
                            console.warn('invalid status.');
                            return;
                        }
                        var max = $('#search-bar').width() -
                            $('.search-bar-item').width() -
                            $('.search-bar-img-box').width() -
                            $('.search-bar-close-div').width();
                        if (max < 0 || strWidth < 0) {
                            console.warn('invalid status.');
                            return;
                        }
                        if (strWidth > max) {
                            var len = keyWord.length;
                            var idx = len;
                            var text = "";
                            var prefix = $.i18n.t('content.navi.abbrev');
                            max = max - 30;
                            while (strWidth > max) {
                                if (idx <= 0) {
                                    break;
                                }
                                text = keyWord.substring(0, idx);
                                strWidth = this.getTextWidth(text + prefix);
                                if (typeof strWidth !== 'number') {
                                    return;
                                }
                                idx--;
                            }
                            this.searchBarKeyword.text(text + prefix);
                        }
                        else {
                            this.searchBarKeyword.text(viewStatus.getSearchTarget().keyword);
                        }
                    }
                    else {
                        this.searchBarKeyword.html('');
                        this.searchBarKeyword.css('visibility', 'hidden');
                        this.searchBarKeyword.css('margin-left', '2px');
                        $('#search-bar-img').css('visibility', '');
                        if (viewStatus.getSearchTarget().annotationPattern === DPMW.Model.Content.ANNOTATION_KEYWORDE_STAR) {
                            $('#search-bar-img').prop('src', '../res/image/svg/Asset_Altair_Main_Header_Search_Star.svg');
                        }
                        else {
                            $('#search-bar-img').prop('src', '../res/image/svg/Asset_Altair_Main_Header_Search_Asterisk.svg');
                        }
                    }
                    this.showWatiingIcon();
                };
                ExplorerSearchStatusView.prototype.hideSearchStatusBar = function () {
                    var me = this;
                    var viewType = viewStatus.getViewType();
                    if (viewType === Explorer.VIEW_TYPE_SEARCH_DOCUMENTS) {
                        this.$el.show();
                        viewStatus.changeViewType(Explorer.VIEW_TYPE_DOCUMENTS);
                    }
                    else if (viewType === Explorer.VIEW_TYPE_SEARCH_FOLDER) {
                        this.$el.show();
                        viewStatus.changeViewType(Explorer.VIEW_TYPE_FOLDER);
                        $('#new-folder-button').attr('tabindex', me.newFolderButtonTabIndex);
                    }
                    fetchHandler.performFetch({
                        success: function (modelOrCollection, response, options) {
                            $('#search-bar-close').attr('tabindex', -1);
                            console.log('success');
                        },
                        error: function (modelOrCollection, response, options) {
                            var err;
                            if (!options || !options.mwError) {
                                err = DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'Error object does not passed');
                            }
                            else {
                                err = options.mwError;
                            }
                            var errCode = DPMW.mwe.genUserErrorCode(err);
                            var errorInfo = { msgId: null, type: null };
                            switch (err.mwCode) {
                                case DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS:
                                    var statusCode = void 0;
                                    var webApiResCode = void 0;
                                    if (response) {
                                        statusCode = response.status;
                                        if (response.responseJSON && typeof response.responseJSON.error_code === 'string') {
                                            webApiResCode = response.responseJSON.error_code;
                                        }
                                    }
                                    if (400 === statusCode) {
                                        if ('40002' === webApiResCode) {
                                            errorInfo.msgId = 'dialog.error.message.75';
                                            errorInfo.type = 'none';
                                        }
                                        else if ('40005' === webApiResCode) {
                                            errorInfo.msgId = 'dialog.error.message.75';
                                            errorInfo.type = 'none';
                                        }
                                        else {
                                            errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, statusCode, webApiResCode);
                                        }
                                    }
                                    else if (404 === statusCode) {
                                        if ('40401' === webApiResCode) {
                                            if (err.cause && err.cause.path) {
                                                errorInfo.msgId = 'dialog.error.message.57';
                                                errorInfo.type = 'none';
                                                View.Dialog.openErrorDialog({
                                                    message: $.i18n.t(errorInfo.msgId, { folder: err.cause.path, errorCode: errCode }),
                                                    type: errorInfo.type,
                                                }, function (response) { });
                                                return;
                                            }
                                            else {
                                                errorInfo.msgId = 'dialog.error.message.75';
                                                errorInfo.type = 'none';
                                            }
                                        }
                                        else {
                                            errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, statusCode, webApiResCode);
                                        }
                                    }
                                    else if (408 === statusCode) {
                                        if ('40800' === webApiResCode) {
                                            errorInfo.msgId = 'dialog.error.message.72';
                                            errorInfo.type = 'none';
                                        }
                                        else {
                                            errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, statusCode, webApiResCode);
                                        }
                                    }
                                    else {
                                        errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, statusCode, webApiResCode);
                                    }
                                    break;
                                default:
                                    errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode);
                                    break;
                            }
                            View.Dialog.openErrorDialog({
                                message: $.i18n.t(errorInfo.msgId, { errorCode: errCode }),
                                type: errorInfo.type,
                            }, function (response) {
                            });
                        }
                    });
                };
                ExplorerSearchStatusView.prototype.hideWatiingIcon = function () {
                    if (this.currentCollection_.lengthTotal === this.currentCollection_.length) {
                        this.$('#search-bar-waitting-icon').hide();
                    }
                };
                ExplorerSearchStatusView.prototype.showWatiingIcon = function () {
                    this.$('#search-bar-waitting-icon').show();
                };
                ExplorerSearchStatusView.prototype.onViewTypeChanged = function () {
                    var viewType = viewStatus.getViewType();
                    if (viewType === Explorer.VIEW_TYPE_SEARCH_DOCUMENTS ||
                        viewType === Explorer.VIEW_TYPE_SEARCH_FOLDER) {
                        this.$el.show();
                        this.currentCollection_ = viewStatus.getCollection();
                        this.listenTo(this.currentCollection_, 'sync', this.hideWatiingIcon);
                        this.listenTo(this.currentCollection_, 'error', this.hideWatiingIcon);
                    }
                    else {
                        this.$el.hide();
                        this.$('search-bar-waitting-icon').show();
                        this.searchBarKeyword.html('');
                        this.searchBarKeyword.css('visibility', 'hidden');
                        this.searchBarKeyword.css('margin-left', '2px');
                        this.$('#search-bar-img').css('visibility', '');
                    }
                };
                return ExplorerSearchStatusView;
            }(Backbone.View));
            Explorer.ExplorerSearchStatusView = ExplorerSearchStatusView;
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=ExplorerSearchStatusView.js.map