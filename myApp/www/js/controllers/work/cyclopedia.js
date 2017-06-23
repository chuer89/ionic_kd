angular.module('workCyclopedia.controller', [])

.controller('WorkCyclopediaCtrl', function ($scope, $state) {
	$scope.blockData = [{
		name: '黄金',
		style: 'background: #f19149; width: 8rem; padding: 20px 0;'
	}, {
		name: 'K金',
		style: 'background: #facd89; width: 5rem; padding: 20px 0;'
	}, {
		name: '铂金',
		style: 'background: #c9c9c9; width: 5rem; padding: 20px 0;'
	}, {
		name: '钻石',
		style: 'background: #00a0e9; width: 7rem; padding: 20px 0;'
	}, {
		name: '玉石',
		style: 'background: #009944; width: 1rem; height: 1rem;'
	}, {
		name: '银饰',
		style: 'background: #dcdcdc; width: 1rem; height: 1rem;'
	}, {
		name: '金壤玉',
		style: 'background: #009944; width: 1rem; height: 1rem;'
	}, {
		name: '璧玺',
		style: 'background: #486a00; width: 1rem; height: 1rem;'
	}, {
		name: '水晶石',
		style: 'background: #8f82bc; width: 1rem; height: 1rem;'
	}, {
		name: '人造石',
		style: 'background: #626262; width: 1rem; height: 1rem;'
	}, {
		name: '葡萄石',
		style: 'background: #b3d465; width: 1rem; height: 1rem;'
	}];

	$scope.typeData = [{
		name: '蓝宝石',
		color: ''
	}, {
		name: '红宝石'
	}, {
		name: '石榴石'
	}, {
		name: '芙蓉石'
	}, {
		name: '珍珠'
	}, {
		name: '玛瑙石'
	}, {
		name: '蜜蜡'
	}, {
		name: '珊瑚'
	}, {
		name: '琥珀'
	}, {
		name: '猫眼石'
	}]
})
