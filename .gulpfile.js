// VARIABLES & PATHS
let preprocessor = 'sass', // Preprocessor (sass, scss, less, styl)
    fileswatch   = 'html,htm,txt,json,md,woff2,php', // List of files extensions for watching & hard reload (comma separated)
    pageversion  = 'html,htm,php', // List of files extensions for watching change version files (comma separated)
    imageswatch  = 'jpg,jpeg,png,webp,svg', // List of images extensions for watching & compression (comma separated)
    online       = true, // If «false» - Browsersync will work offline without internet connection
    basename     = require('path').basename(__dirname),
    forProd      = [
					'/**',
					' * @author Alexsab.ru',
					' */',
					''].join('\n');

const { src, dest, parallel, series, watch, task } = require('gulp'),
	sass           = require('gulp-sass'),
	cleancss       = require('gulp-clean-css'),
	concat         = require('gulp-concat'),
	browserSync    = require('browser-sync').create(),
	uglify         = require('gulp-uglify-es').default,
	autoprefixer   = require('gulp-autoprefixer'),
	imagemin       = require('gulp-imagemin'),
	newer          = require('gulp-newer'),
	rsync          = require('gulp-rsync'),
	del            = require('del'),
	connect        = require('gulp-connect-php'),
	header         = require('gulp-header'),
	notify         = require('gulp-notify'),
	sourcemaps     = require('gulp-sourcemaps'),
	rename         = require('gulp-rename'),
	responsive     = require('gulp-responsive'),
	pngquant       = require('imagemin-pngquant'),
	merge          = require('merge-stream'),
	// version        = require('gulp-version-number'),
	// revAll         = require('gulp-rev-all'),
	replace        = require('gulp-replace');

if(typeof projects == 'undefined') 
	global.projects = {};
if(typeof port == 'undefined') 
	global.port = 8100;


projects.promo_nissan = {

	port: ++port,

	base: basename,
	dest: basename,

	styles: {
		src:    basename + '/resources/' + preprocessor + '/**/*',
		dest:   basename + '/public/css',
		output: 'main.min.css',
	},

	scripts: {
		src: [
			'node_modules/jquery/dist/jquery.min.js',
			basename + '/resources/libs/fancybox/jquery.fancybox.min.js',
			basename + '/resources/libs/jquery.inputmask.bundle.min.js',
			basename + '/resources/libs/aos/aos.js',
			basename + '/resources/libs/timer/timer.js',
			basename + '/resources/js/map.js',
			basename + '/resources/js/common.js',
		],
		dest:       basename + '/public/js',
		output:     'scripts.min.js',
	},

	images: {
		src:  basename + '/resources/img/**/*',
		dest: basename + '/public/img',
	},

	code: {
		src: [
			basename  + '/**/*.{' + fileswatch + '}'
		],
	},
	forProd: [
		'/**',
		' * @author https://github.com/newstreetpunk',
		' * @author https://github.com/alexsab',
		' */',
		''].join('\n'),
}



/* promo_nissan END */

// Local Server
function promo_nissan_browsersync() {
	connect.server({
		port: projects.promo_nissan.port,
		base: projects.promo_nissan.base,
	}, function (){
		browserSync.init({
			//server: { baseDir: projects.kia.base + '/' },
			proxy: '127.0.0.1:' + projects.promo_nissan.port,
			notify: false,
			online: online
		});
	});
};

// Styles
function promo_nissan_styles() {
	return src(projects.promo_nissan.styles.src)
	.pipe(sourcemaps.init())
	.pipe(eval(preprocessor)({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(concat(projects.promo_nissan.styles.output))
	// .pipe(sourcemaps.write({includeContent: false}))
	// .pipe(sourcemaps.init({loadMaps: true}))
	.pipe(autoprefixer({ grid: true, overrideBrowserslist: ['last 10 versions'] }))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Optional. Comment out when debugging
	.pipe(sourcemaps.write())
	.pipe(dest(projects.promo_nissan.styles.dest))
	.pipe(browserSync.stream())

};

// Scripts
function promo_nissan_scripts() {
	return src(projects.promo_nissan.scripts.src)
	.pipe(concat(projects.promo_nissan.scripts.output))
	.pipe(uglify()) // Minify js (opt.)
	.pipe(header(projects.promo_nissan.forProd))
	.pipe(dest(projects.promo_nissan.scripts.dest))
	.pipe(browserSync.stream())
};

// Images
function promo_nissan_images() {
	return src(projects.promo_nissan.images.src)
	.pipe(newer(projects.promo_nissan.images.dest))
	.pipe(imagemin({
			progressive: true,
    		optimizationLevel: 10,
            svgoPlugins: [{removeViewBox: false}],
    		use: [pngquant()]            
        },{
            verbose: true
        }))
	.pipe(dest(projects.promo_nissan.images.dest))
}
function promo_nissan_cleanimg() {
	return del('' + projects.promo_nissan.images.dest + '/**/*', { force: true })
}

// Watch
function promo_nissan_watch() {
	watch(projects.promo_nissan.styles.src, promo_nissan_styles);
	watch(projects.promo_nissan.scripts.src, promo_nissan_scripts);
	// watch(projects.promo_nissan.images.src, promo_nissan_cleanimg); // почему закоменчено?
	watch(projects.promo_nissan.images.src, promo_nissan_images);
	watch(projects.promo_nissan.code.src).on('change', browserSync.reload);
};

exports.promo_nissan_cleanimg = promo_nissan_cleanimg;
exports.promo_nissan = parallel(promo_nissan_images, promo_nissan_styles, promo_nissan_scripts, promo_nissan_browsersync, promo_nissan_watch);

/* promo_nissan END */