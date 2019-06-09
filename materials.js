galaxysim.cubemap_path = 'assets/cubemaps/';
galaxysim.milky_way = ['GalaxyTex_PositiveX.jpg',
    'GalaxyTex_NegativeX.jpg',
    'GalaxyTex_PositiveY.jpg',
    'GalaxyTex_NegativeY.jpg',
    'GalaxyTex_PositiveZ.jpg',
    'GalaxyTex_NegativeZ.jpg'
];

galaxysim.light_blue = ['BlueNebular_left.jpg',
    'BlueNebular_right.jpg',
    'BlueNebular_top.jpg',
    'BlueNebular_bottom.jpg',
    'BlueNebular_front.jpg',
    'BlueNebular_back.jpg'
];

galaxysim.blue = ['bkg1_left.jpg',
    'bkg1_right.jpg',
    'bkg1_top.jpg',
    'bkg1_bottom.jpg',
    'bkg1_front.jpg',
    'bkg1_back.jpg'
];

galaxysim.red = ['bkg2_left.jpg',
    'bkg2_right.jpg',
    'bkg2_top.jpg',
    'bkg2_bottom.jpg',
    'bkg2_front.jpg',
    'bkg2_back.jpg'
];

galaxysim.cubemaps_urls = [galaxysim.milky_way, 
    galaxysim.light_blue, 
    galaxysim.blue, 
    galaxysim.red
];
galaxysim.cubemaps = [];

galaxysim.createAllMaterials = function() {

    function createParticleMaterial(texture, size, color, blending, opacity) {
        return new THREE.PointCloudMaterial({
            color: color,
            opacity: opacity,
            size: size,
            map: texture,
            blending: blending,
            depthTest: false,
            transparent: true,
            vertexColors: THREE.VertexColors
        });
    }

    var starLargeTexture = THREE.ImageUtils.loadTexture("assets/star_large.png");
    var starSmallTexture = THREE.ImageUtils.loadTexture("assets/star_small.png");
    var gasCloudTexture = THREE.ImageUtils.loadTexture("assets/cloud.png");

    for (var i=0; i < galaxysim.cubemaps_urls.length; i++) {
        var cubemap = new THREE.CubeTextureLoader()
            .setPath(galaxysim.cubemap_path)
            .load(galaxysim.cubemaps_urls[i]);
        cubemap.format = THREE.RGBFormat;
        galaxysim.cubemaps.push(cubemap);
    }

    return {
        bright: createParticleMaterial(starLargeTexture, 140, 0xffffff, THREE.AdditiveBlending, 0.0),
        brightSmall: createParticleMaterial(starSmallTexture, 80, 0xffffff, THREE.AdditiveBlending, 0.0),
        gasCloud: createParticleMaterial(gasCloudTexture, 900, 0xffffff, THREE.NormalBlending, 0.18)
    }
};
