<?php
/*
Template Name: Home New Template
*/

get_header(); ?>

<style>
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
@media (min-width: 768px) {
    .hero-section {
        margin-top: 150px;
    }
}
@media screen {
    .hero-section {
        margin-top: 200px;
    }
}

/* Responsive styles for testimonial arrows */
@media (max-width: 991px) {
    .slider-arrow.prev {
        left: -40px !important;
    }
    .slider-arrow.next {
        right: -40px !important;
    }
}
@media (max-width: 767px) {
    .slider-arrow.prev {
        left: -30px !important;
    }
    .slider-arrow.next {
        right: -30px !important;
    }
}

@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-100px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(100px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes scaleIn {
    from {
        transform: scale(0.8);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes float {
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-10px);
    }
    100% {
        transform: translateY(0px);
    }
}
.slider-arrow{
    padding:0px !important
}
 .prev{
    margin-left:10% !important;
}
.next{
    margin-right:10% !important;
}
.about-section {
    padding: 60px 0;
    background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
    position: relative;
    overflow: hidden;
}

.about-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f19820' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
.wppsac-wrap .wppsac-post-image{
    height: 200px;
    width: 400px;
    object-fit: cover;
}
.about-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    animation: fadeInUp 1s ease-out;
}

.about-text {
    margin-bottom: 30px;
    line-height: 1.8;
}
.case-studies-list{
    display: flex;
	gap: 30px;
   
}

@media (max-width: 768px) {
    .case-studies-list {
        display: flex;
        flex-direction: column;
    }
}
.about-text > div {
    backdrop-filter: blur(5px);
    background: rgba(255, 255, 255, 0.9);
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    margin-bottom: 40px;
}

.stat-box {
    text-align: center;
    padding: 25px 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    animation: float 3s ease-in-out infinite;
    backdrop-filter: blur(5px);
    cursor: pointer;
}

.stat-box:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(241, 152, 32, 0.2);
}

.stat-number {
    font-size: 3.5rem;
    font-weight: bold;
    background: linear-gradient(135deg, #F19820 0%, #ff6b6b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 15px;
}

.stat-label {
    font-size: 1.2rem;
    color: #2c3e50;
    font-weight: 500;
}
.wppsac-post-slider-init{
    overflow:hidden !important;
}
.services-section {
    background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
    padding: 60px 0;
    position: relative;
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 25px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.service-card {
    background: rgba(255, 255, 255, 0.9);
    padding: 25px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    backdrop-filter: blur(5px);
    border: 2px solid transparent;
    animation: scaleIn 0.5s ease-out;
    cursor: pointer;
}

.service-card:hover {
    transform: translateY(-10px) scale(1.02);
    border-color: #F19820;
    box-shadow: 0 20px 40px rgba(241, 152, 32, 0.2);
}

.service-title {
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 20px;
    color: #2c3e50;
    position: relative;
    padding-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.service-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background: linear-gradient(135deg, #F19820 0%, #ff6b6b 100%);
    border-radius: 3px;
}
/* Hover effect for subcategory links only */
.subcategory-list .service-link:hover {
                    transform: translateX(10px);
                    box-shadow: 6px 6px 12px #d9d9d9, -6px -6px 12px #ffffff;
                }
                
                /* No hover effect for main category links */
                li > div > .service-link:hover {
                    transform: none;
                    box-shadow: none;
                }
                .service-card:hover {
                    transform: translateY(-5px);
                }
                .icon-container {
                    transition: transform 0.3s ease;
                    border-radius: 50% !important;
                    aspect-ratio: 1/1 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                
                /* Chevron animation */
                .chevron-icon {
                    transition: transform 0.3s ease-in-out;
                }
                
                .chevron-icon.open {
                    transform: rotate(180deg);
                }
                /* Icon animation only for subcategory links */
.subcategory-list .service-link:hover .icon-container {
                    transform: rotate(360deg);
                }
                @media (max-width: 768px) {
                    .service-card {
                        margin: 15px 10px;
                    }
                }

.service-title i {
    color: #F19820;
    font-size: 1.2em;
}

.testimonials-section {
    padding: 60px 0;
    background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
    position: relative;
}

.testimonial-slider {

    margin: 0 auto;
    padding: 30px 20px;
}

.testimonial-card {
    background: rgba(255, 255, 255, 0.9);
    padding: 25px;
    border-radius: 15px;
    margin: 30px 20px;
    border-left: none;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    position: relative;
    backdrop-filter: blur(5px);
    animation: slideInRight 0.5s ease-out;
    cursor: pointer;
}

.testimonial-card::before {
    content: '"';
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 60px;
    color: #F19820;
    opacity: 0.2;
}

.testimonial-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(241, 152, 32, 0.2);
}

.testimonial-text {
    font-style: italic;
    margin: 20px 0;
    line-height: 1.8;
    color: #2c3e50;
    position: relative;
    z-index: 1;
}

.testimonial-author {
    font-weight: bold;
    color: #F19820;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 10px;
}
.about-text-container{
    display: flex;
    gap: 25px;
    align-items: center;
}
@media (max-width: 768px) {
    .about-text-container {
        flex-direction: column;
    }
}
.testimonial-author::before {
    content: '';
    width: 30px;
    height: 2px;
    background: linear-gradient(135deg, #F19820 0%, #ff6b6b 100%);
}

.section-title {
    text-align: center;
    font-size: 3rem;
    margin-bottom: 60px;
    color: #2c3e50;
    position: relative;
    padding-bottom: 20px;
    animation: fadeInUp 0.5s ease-out;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
}

.section-title i {
    color: #F19820;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(135deg, #F19820 0%, #ff6b6b 100%);
    border-radius: 4px;
}

/* Add Font Awesome icons */
.icon-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: inherit;
    transition: color 0.3s ease;
}

.icon-link:hover {
    color: #F19820;
}

.icon-link i {
    font-size: 1.2em;
}
</style>

<!-- Add Font Awesome CDN -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
<div class="hero-section" style="
    position: relative;
    width: 100%;
    height: 500px;
    overflow: hidden;
    margin-bottom: 60px;
 
">
    <img 
        src="https://staging.profici.co.uk/jostec/wp-content/uploads/2025/01/jostec-banner.png"
        alt="JosTec Hero Banner"
        style="
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: brightness(0.4);
        "
    >
    <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        width: 100%;
        padding: 20px;
        margin-top: 40px;
       
    ">
        <h1 style="
            font-size: 4.5rem;
            font-weight: bold;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 3px;
            color: #ffffff;
            background: linear-gradient(120deg, #ffffff, #e0e0e0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 2s infinite linear;
            opacity: 0;
            transform: translateY(30px);
            animation: fadeInUp 1s ease forwards, shimmer 2s infinite linear;
        ">
            Planning and Building Regulation<br>Compliance Services
        </h1>
        <a href="/contact" class="btn" style="
            display: inline-block;
            padding: 15px 30px;
            background-color: #F19820;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 1.2rem;
            font-weight: bold;
            margin-top: 20px;
            transition: background-color 0.3s ease;
        " onmouseover="this.style.backgroundColor='#d87f0d'" onmouseout="this.style.backgroundColor='#F19820'">
            Get a Free Quote
        </a>
    </div>
</div>

<div class="about-section">
    <div class="about-content">
        <div class="about-text">
            <div class="about-text-container">
                <div style="flex: 1;">
                    <h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 30px; color: #F19820;">About Us</h2>
                    <p style="margin-bottom: 20px;">Formed in 2010, JosTec (formerly RJ Acoustics) are experts in numerous Planning & Building Regulations Compliance Services. We offer Sound Insulation Testing, Acoustic Design and Consultancy for Building Regulations Part E, Air Tightness Tests, SAP Calculations, SBEM Calculations and EPCs for Building Regulations Part L1, Ventilation Testing and Commissioning for Building Regulations Part F, Water Efficiency Calculations for Building Regulations Part G, Overheating Calculations for Building Regulations Part O and all types of Noise Assessments and Surveys, Energy Statements, Energy Saving & Reducing Carbon Emissions Reduction Services for Homeowners in existing properties.</p>

                    <p style="margin-bottom: 20px;">Our aim is that you never need to look further than JosTec for all of your building compliance needs.</p>

                    <p>We cover all parts of England and Wales and are fully accredited/qualified in all our fields.</p>
                    <a href="/about-us" style="
                display: inline-block;
                padding: 12px 25px;
                background-color: #F19820;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-size: 1.1rem;
                transition: background-color 0.3s ease;
            " onmouseover="this.style.backgroundColor='#d87f0d'" onmouseout="this.style.backgroundColor='#F19820'">
                Read More
            </a>
                </div>
                <div style="flex: 1;">
                    <img src="https://staging.profici.co.uk/jostec/wp-content/uploads/2021/03/about_3-optimized.jpg" alt="About JosTec" style="width: 100%; height: auto; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                </div>
            </div>
        </div>
        <div style="text-align: center; margin-top: 30px;">
            
        </div>

        <div class="stats-grid">
            <div class="stat-box">
                <i class="fas fa-clock fa-2x" style="color: #F19820; margin-bottom: 15px;"></i>
                <div class="stat-number">20+</div>
                <div class="stat-label">Years of Experience</div>
            </div>
            <div class="stat-box" style="animation-delay: 0.2s;">
                <i class="fas fa-users fa-2x" style="color: #F19820; margin-bottom: 15px;"></i>
                <div class="stat-number">12+</div>
                <div class="stat-label">Small, growing team</div>
            </div>
            <div class="stat-box" style="animation-delay: 0.4s;">
                <i class="fas fa-smile fa-2x" style="color: #F19820; margin-bottom: 15px;"></i>
                <div class="stat-number">3000+</div>
                <div class="stat-label">Satisfied Customers</div>
            </div>
        </div>
    </div>
</div>
<div class="services-section">
    <h2 class="section-title"><i class="fas fa-tools"></i>Our Services</h2>
    <p style="text-align: center; color: #666; margin-bottom: 30px; max-width: 800px; margin-left: auto; margin-right: auto;">Explore our comprehensive range of services designed to help you navigate the complexities of building regulations and compliance.</p>
    <div class="services-grid">
        <?php
        $services = array(
            'Planning Services' => array(
                'Noise, Vibration and Dust Assessments' => array(
                    'link' => '/services/noise-assessments-surveys/',
                    'icon' => 'fa-volume-up',
                    'subcategories' => array(
                        'Noise Impact Assessment' => array('link' => '/services/noise-assessments-surveys/noise-impact-assessment/', 'icon' => 'fa-file-alt'),
                        'Long Term Noise, Vibration and Dust Monitoring' => array('link' => '/services/noise-assessments-surveys/long-term-monitoring/', 'icon' => 'fa-chart-line'),
                        'Section 61' => array('link' => '/services/noise-assessments-surveys/section-61/', 'icon' => 'fa-gavel'),
                        'Construction Environmental Management Plans' => array('link' => '/services/noise-assessments-surveys/construction-environmental-management-plans/', 'icon' => 'fa-hard-hat'),
                        'Delivery Noise Management Plans' => array('link' => '/services/noise-assessments-surveys/delivery-noise-management-plans/', 'icon' => 'fa-truck'),
                        'BREEAM Hea-05 and Pol-05' => array('link' => '/services/noise-assessments-surveys/breeam-hea-05-pol-05/', 'icon' => 'fa-certificate'),
                        'Noise At Work' => array('link' => '/services/noise-assessments-surveys/noise-at-work/', 'icon' => 'fa-user')
                    )
                ),
                'Energy & Sustainability Statements' => array('link' => '/services/energy-statements/', 'icon' => 'fa-leaf'),
                'Water Efficiency Calculations' => array('link' => '/services/water-efficiency-calculations/', 'icon' => 'fa-tint') 
            ),
            'Design Stage Services' => array(
                'SAP Calculations and EPCs' => array('link' => '/services/sap/', 'icon' => 'fa-calculator'),
                'SBEM Calculations and EPCs' => array('link' => '/services/sbem-calculations/', 'icon' => 'fa-building'),
                'Overheating Calculations' => array('link' => '/services/overheating-calculations/', 'icon' => 'fa-thermometer-full'),
                'Acoustic Consultancy and Design' => array('link' => '/services/acoustic-design-and-consultancy/', 'icon' => 'fa-wave-square')
            ),
            'Building Control sign-off services' => array(
                'Air Tightness Testing' => array('link' => '/services/air-tightness-testing/', 'icon' => 'fa-wind'),
                'Sound Insulation Testing' => array('link' => '/services/sound-insulation-testing/', 'icon' => 'fa-volume-mute'),
                'Ventilation Testing & Commissioning' => array('link' => '/services/ventilation-testing-commissioning/', 'icon' => 'fa-fan'),
                'Commercial EPCs' => array('link' => '/services/commercialepc/', 'icon' => 'fa-certificate')
            )
        );

        $descriptions = array(
            'Planning Services' => 'Expert guidance and assessments for planning applications and compliance.',
            'Design Stage Services' => 'Comprehensive calculations and consultancy for optimal building design.',
            'Building Control sign-off services' => 'Professional testing and certification for building regulations compliance.'
        );

        $delay = 0;
        foreach($services as $category => $service_list): ?>
            <div class="service-card" style="animation-delay: <?php echo $delay; ?>s; background: linear-gradient(145deg, #ffffff, #f5f5f5); padding: 30px; border-radius: 20px; margin: 20px 0; box-shadow: 10px 10px 20px #d9d9d9, -10px -10px 20px #ffffff; position: relative; overflow: hidden;">
                <h3 class="service-title" style="margin-bottom: 15px; color: #F19820; font-size: 2rem; position: relative;">
                    <span style="position: relative; z-index: 1;"><?php echo $category; ?></span>
                    <div style="position: absolute; bottom: -5px; left: 0; width: 50px; height: 3px; background: #F19820;"></div>
                </h3>
                <p style="color: #666; margin-bottom: 20px; font-size: 1.2rem;"><?php echo $descriptions[$category]; ?></p>
                <ul style="list-style-type: none; padding: 0;">
                    <?php foreach($service_list as $service => $details): ?>
                        <li style="margin-bottom: 25px; transform-origin: left; transition: transform 0.3s ease;">
                            <div style="display: flex; align-items: center; gap: 15px; padding: 15px; border-radius: 10px; background: white; box-shadow: 4px 4px 8px #e6e6e6, -4px -4px 8px #ffffff; transition: all 0.3s ease; position: relative;">
                                <div class="icon-container" style="background: #F19820; width: 40px; height: 40px;">
                                    <i class="fas <?php echo $details['icon']; ?>" style="color: white;"></i>
                                </div>
                                <a href="<?php echo esc_url(home_url($details['link'])); ?>" class="service-link" style="font-weight: 500; color: #333; text-decoration: none; flex-grow: 1; pointer-events: auto;"><?php echo $service; ?></a>
                                <?php if (isset($details['subcategories']) && !empty($details['subcategories'])): ?>
                                <div class="toggle-icon" style="cursor: pointer;">
                                    <i class="fas fa-chevron-down chevron-icon" style="color: #F19820; transition: transform 0.3s ease;"></i>
                                </div>
                                <?php endif; ?>
                            </div>
                            
                            <?php if (isset($details['subcategories']) && !empty($details['subcategories'])): ?>
                                <ul class="subcategory-list" style="list-style-type: none; padding-left: 55px; margin-top: 10px; display: none;">
                                    <?php foreach($details['subcategories'] as $subservice => $subdetails): ?>
                                        <li style="margin-bottom: 10px;">
                                             <a href="<?php echo esc_url(home_url($subdetails['link'])); ?>" class="service-link" style="display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: 8px; background: #f9f9f9; transition: all 0.3s ease;">
                                                <?php if (isset($subdetails['icon'])): ?>
                                                <div class="icon-container" style="background: #F19820; width: 30px; height: 30px;">
                                                    <i class="fas <?php echo $subdetails['icon']; ?>" style="color: white; font-size: 0.8em;"></i>
                                                </div>
                                                <?php endif; ?>
                                                <span style="font-weight: 400; color: #555; font-size: 0.95em;"><?php echo $subservice; ?></span>
                                            </a>
                                        </li>
                                    <?php endforeach; ?>
                                </ul>
                            <?php endif; ?>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
           
        <?php 
        $delay += 0.2;
        endforeach; ?>
    </div>
</div>
<div class="recent-posts-section" style="max-width: 80%; margin: 30px auto;">
    <h2 class="section-title"><i class="fas fa-newspaper"></i>Latest News and Blog Posts</h2>
    <p style="text-align: center; color: #666; margin-bottom: 30px; max-width: 800px; margin-left: auto; margin-right: auto;">Stay updated with our latest news and blog posts. We cover a wide range of topics from building regulations to energy efficiency and sustainability.</p>
    <div style="overflow-x: auto;">
        <div style="min-height: 500px;">
            <?php echo do_shortcode('[recent_post_carousel slides_to_show="3" slides_to_scroll="1"]'); ?>
        </div>
    </div>
</div>
<div class="client-logos-section" style="max-width: 80%; margin: 0 auto;">
    <h2 class="section-title"><i class="fas fa-building"></i>Our Clients</h2>
    <p style="text-align: center; color: #666; margin-bottom: 30px; max-width: 800px; margin-left: auto; margin-right: auto;">
        Proud to partner with leading organizations across industries. Here are some of the companies that trust us with their projects.
    </p>
    <?php echo do_shortcode('[lgxlogoslider id="11523"]'); ?>
</div>

<div class="case-studies-section" style="max-width: 80%; margin: 30px auto;">
    <h2 class="section-title"><i class="fas fa-briefcase"></i>Case Studies</h2>
    <p style="text-align: center; color: #666; margin-bottom: 30px; max-width: 800px; margin-left: auto; margin-right: auto;">
        Explore our collection of successful projects and discover how we've helped businesses achieve their goals through innovative solutions and expert services.
    </p>
 <?php echo do_shortcode('[case_studies]'); ?> 
  
</div>
<div class="testimonials-section" style="margin: 60px auto;">
    <h2 class="section-title" style="text-align: center; margin-bottom: 30px; color: #333; font-size: 32px;">
        <span style="color: #F19820; font-size: 36px;">&ldquo;</span> Testimonials
    </h2>
   >
    <button class="slider-arrow prev" style="position: absolute; left: -80px; top: 50%; transform: translateY(-50%); z-index: 2; background: #F19820; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; color: white; display: flex; align-items: center; justify-content: center;"><i class="fas fa-chevron-left"></i></button>
    <button class="slider-arrow next" style="position: absolute; right: -80px; top: 50%; transform: translateY(-50%); z-index: 2; background: #F19820; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; color: white; display: flex; align-items: center; justify-content: center;"><i class="fas fa-chevron-right"></i></button>
    <div class="testimonial-slider" style="position: relative; max-width: 80%; margin: 0 auto;">
      
        
        <div class="testimonial-container" style="overflow: hidden;">
            <div class="testimonial-card" style="background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 30px; text-align: left;">
                <div class="testimonial-text" style="font-size: 16px; line-height: 1.6; color: #555; font-style: italic; margin-bottom: 20px;">"Thanks so much for getting everything over to me so quickly. I just wanted to express my thanks for your attitude and professionalism. We've had struggles with other testing companies in the past, but your efficiency and knowledge is really refreshing. We won't look anywhere else for sound, air and ventilation testing in the future."</div>
                <div class="testimonial-author" style="display: flex; align-items: center;">
                    <span style="display: inline-block; width: 4px; height: 20px; background-color: #F19820; margin-right: 10px;"></span>
                    <span style="color: #F19820; font-weight: bold;"><i class="fas fa-user-circle" style="margin-right: 8px;"></i>Jonathan Ellis, Hamilton Court Developments, MD</span>
                </div>
            </div>
        </div>
        
        <div class="slider-indicators" style="text-align: center; margin-top: 30px;">
            <span class="indicator" style="display: inline-block; width: 12px; height: 12px; margin: 0 5px; background-color: #ccc; border-radius: 50%; cursor: pointer;"></span>
            <span class="indicator active" style="display: inline-block; width: 12px; height: 12px; margin: 0 5px; background-color: #F19820; border-radius: 50%; cursor: pointer;"></span>
            <span class="indicator" style="display: inline-block; width: 12px; height: 12px; margin: 0 5px; background-color: #ccc; border-radius: 50%; cursor: pointer;"></span>
        </div>
    </div>
</div>
<div class="gallery-section" style="max-width: 80%; margin: 30px auto;">
   
    <?php echo do_shortcode('[meta_gallery_carousel id="10366" slide_to_show="3"]'); ?>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Toggle subcategories
    const toggleIcons = document.querySelectorAll('.toggle-icon');
    
    toggleIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const listItem = this.closest('li');
            const subcategoryList = listItem.querySelector('.subcategory-list');
            const toggleIcon = this.querySelector('i');
            
            if (subcategoryList.style.display === 'none' || subcategoryList.style.display === '') {
                // Open animation
                subcategoryList.style.display = 'block';
                toggleIcon.classList.add('open');
                
                // Optional: animate the subcategory list
                subcategoryList.style.maxHeight = '0';
                setTimeout(() => {
                    subcategoryList.style.transition = 'max-height 0.3s ease-in-out';
                    subcategoryList.style.maxHeight = subcategoryList.scrollHeight + 'px';
                }, 10);
            } else {
                // Close animation
                toggleIcon.classList.remove('open');
                
                // Optional: animate the subcategory list closing
                subcategoryList.style.maxHeight = '0';
                
                // Wait for animation to complete before hiding
                setTimeout(() => {
                    subcategoryList.style.display = 'none';
                    subcategoryList.style.transition = '';
                }, 300);
            }
        });
    });
    
    // Testimonial data
    const testimonials = [
        {
            text: "I have been dealing with JosTec for about 4 years, a really good firm who actually carried out what they promise. Always good to take advice from them from the outset, so that when you come to your final results there won't be any surprises. A dynamic firm which really satisfied the needs of the building industry, very resourceful and informative and good value, friendly and easy to get on with, and who will go the extra mile for you. I have used them on all my sites.",
            author: "Neville Nash, Zibcrest Homes, Director"
        },
        {
            text: "Thanks so much for getting everything over to me so quickly. I just wanted to express my thanks for your attitude and professionalism. We've had struggles with other testing companies in the past, but your efficiency and knowledge is really refreshing. We won't look anywhere else for sound, air and ventilation testing in the future.",
            author: "Jonathan Ellis, Hamilton Court Developments, MD"
        },
        {
            text: "JosTec have been very professional and helpful in the air permeability and sound insulation testing for the 179 plots I have just completed. They have been very obliging in advising on the best way to achieve the results we required for this site. With fast issue of certification when required, I would certainly use and recommend JosTec for future work. Pleasure to work with.",
            author: "Dean Chinsky, Taylor Wimpey, Site Manager"
        }
    ];
    
    const sliderContainer = document.querySelector('.testimonial-container');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    const indicators = document.querySelectorAll('.indicator');
    
    let currentSlide = 1; // Start with the second testimonial (as shown in screenshot)
    
    // Function to update the testimonial content
    function updateTestimonial() {
        const testimonial = testimonials[currentSlide];
        
        // Update the content
        sliderContainer.innerHTML = `
            <div class="testimonial-card" style="background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 30px; text-align: left;">
                <div class="testimonial-text" style="font-size: 16px; line-height: 1.6; color: #555; font-style: italic; margin-bottom: 20px;">${testimonial.text}</div>
                <div class="testimonial-author" style="display: flex; align-items: center;">
                    <span style="display: inline-block; width: 4px; height: 20px; background-color: #F19820; margin-right: 10px;"></span>
                    <span style="color: #F19820; font-weight: bold;"><i class="fas fa-user-circle" style="margin-right: 8px;"></i>${testimonial.author}</span>
                </div>
            </div>
        `;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.style.backgroundColor = '#F19820';
            } else {
                indicator.style.backgroundColor = '#ccc';
            }
        });
    }
    
    // Initialize with the current slide
    updateTestimonial();
    
    // Next slide function
    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonials.length;
        updateTestimonial();
    }
    
    // Previous slide function
    function prevSlide() {
        currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
        updateTestimonial();
    }
    
    // Add click event listeners to buttons
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Add click event listeners to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateTestimonial();
        });
    });
    
    // Auto advance slides every 5 seconds
    let autoSlideInterval = setInterval(nextSlide, 5000);
    
    // Pause auto-sliding when hovering over the slider
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
    });
    
    // Add hover effects for buttons
    [prevBtn, nextBtn].forEach(btn => {
        btn.addEventListener('mouseover', () => {
            btn.style.background = '#d87f0d';
        });
        btn.addEventListener('mouseout', () => {
            btn.style.background = '#F19820';
        });
    });
});
</script>

<?php get_footer(); ?>
