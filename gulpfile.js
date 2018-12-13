var gulp = require('gulp');

/*Plugins*/
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var notify       = require("gulp-notify");
var plumber      = require('gulp-plumber');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
const babel      = require('gulp-babel');
var rename       = require('gulp-regex-rename');


gulp.task('watch', function() {
  gulp.watch(['./css/**/*.scss'], ['css'])
	.on('change', function () {
        notify("Conversion css OK").write('');
	});
});

// tache CSS = compile vers style.css et ajoute style.css.map
gulp.task('css', function () {
	var onError = function(err) {
		notify.onError({
			title:    "Gulp",
			subtitle: "Problème!",
			message:  "Erreur CSS: <%= error.message %>",
			sound:    "Beep"
		})(err);
		this.emit('end');
	};
  return gulp.src('./css/*.scss')
    .pipe(plumber({errorHandler: onError}))
	.pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer())
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./css'));
});


gulp.task('default', ['css', 'concat_minif']);

var svgSprite    = require('gulp-svg-sprite');
//var plumber      = require('gulp-plumber');
var baseDir      = './img/svg';   // <-- Set to your SVG base directory
//var baseDir      = 'svgmin';   // <-- Set to your SVG base directory
var svgGlob      = '**/*.svg';       // <-- Glob to match your SVG files
var outDir       = './img/';     // <-- Main output directory
var config       = {
	"shape": {
		"spacing": {
			"box": "icon"
		}
	},
	"mode": {
/*		"view": {
			"dest": ".",
			"sprite": "sprite_css_pictos.svg",
			"bust": false
		},
*/
		"symbol": {
			"dest": ".",
			"sprite": "sprite_symbol_pictos.svg",
		}
	}
};

gulp.task('svgsprite', function() {
    return gulp.src(svgGlob, {cwd: baseDir})
        .pipe(plumber())
        .pipe(svgSprite(config)).on('error', function(error){ console.log(error); })
        .pipe(gulp.dest(outDir));
});

var svgmin = require('gulp-svgmin');

gulp.task('svgmin', function () {
    return gulp.src('./svg/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest('./svgmin'));
});
