import React from 'react';

const Empty = () => {
  const styles = {
    bgPurple: {
      background: 'url(http://salehriaz.com/404Page/img/bg_purple.png)',
      backgroundRepeat: 'repeat-x',
      backgroundSize: 'cover',
      backgroundPosition: 'left top',
      height: '100vh',
      overflow: 'hidden',
    },
    customNavbar: {
      paddingTop: '15px',
    },
    brandLogo: {
      marginLeft: '25px',
      marginTop: '5px',
      display: 'inline-block',
    },
    navbarLinks: {
      display: 'inline-block',
      float: 'right',
      marginRight: '15px',
      textTransform: 'uppercase',
    },
    ul: {
      listStyleType: 'none',
      margin: '0',
      padding: '0',
      display: 'flex',
      alignItems: 'center',
    },
    li: {
      float: 'left',
      padding: '0px 15px',
    },
    liLink: {
      display: 'block',
      color: 'white',
      textAlign: 'center',
      textDecoration: 'none',
      letterSpacing: '2px',
      fontSize: '12px',
      transition: 'all 0.3s ease-in',
    },
    liLinkHover: {
      color: '#ffcb39',
    },
    btnRequest: {
      padding: '10px 25px',
      border: '1px solid #FFCB39',
      borderRadius: '100px',
      fontWeight: '400',
    },
    btnRequestHover: {
      backgroundColor: '#FFCB39',
      color: '#fff',
      transform: 'scale(1.05)',
      boxShadow: '0px 20px 20px rgba(0,0,0,0.1)',
    },
    btnGoHome: {
      position: 'relative',
      zIndex: '200',
      margin: '15px auto',
      width: '100px',
      padding: '10px 15px',
      border: '1px solid #FFCB39',
      borderRadius: '100px',
      fontWeight: '400',
      display: 'block',
      color: 'white',
      textAlign: 'center',
      textDecoration: 'none',
      letterSpacing: '2px',
      fontSize: '11px',
      transition: 'all 0.3s ease-in',
    },
    btnGoHomeHover: {
      backgroundColor: '#FFCB39',
      color: '#fff',
      transform: 'scale(1.05)',
      boxShadow: '0px 20px 20px rgba(0,0,0,0.1)',
    },
    centralBody: {
      padding: '17% 5% 10% 5%',
      textAlign: 'center',
    },
    objectsImg: {
      zIndex: '90',
      pointerEvents: 'none',
    },
    objectRocket: {
      zIndex: '95',
      position: 'absolute',
      transform: 'translateX(-50px)',
      top: '75%',
      pointerEvents: 'none',
      animation: 'rocket-movement 200s linear infinite both running',
    },
    objectEarth: {
      position: 'absolute',
      top: '20%',
      left: '15%',
      zIndex: '90',
    },
    objectMoon: {
      position: 'absolute',
      top: '12%',
      left: '25%',
    },
    earthMoon: {},
    objectAstronaut: {
      animation: 'rotate-astronaut 200s infinite linear both alternate',
    },
    boxAstronaut: {
      zIndex: '110 !important',
      position: 'absolute',
      top: '60%',
      right: '20%',
      willChange: 'transform',
      animation: 'move-astronaut 50s infinite linear both alternate',
    },
    image404: {
      position: 'relative',
      zIndex: '100',
      pointerEvents: 'none',
    },
    stars: {
      background: 'url(http://salehriaz.com/404Page/img/overlay_stars.svg)',
      backgroundRepeat: 'repeat',
      backgroundSize: 'contain',
      backgroundPosition: 'left top',
    },
    glowingStars: {
      display: 'flex',
      justifyContent: 'center',
    },
    star: {
      position: 'absolute',
      borderRadius: '100%',
      backgroundColor: '#fff',
      width: '3px',
      height: '3px',
      opacity: '0.3',
      willChange: 'opacity',
    },
  };

  return (

<div style={{
  height:"100vh",
  width:"100%"
}}>
    <body style={styles.bgPurple}>
      <div style={styles.stars}>
        <div style={styles.customNavbar}>
          <div style={styles.brandLogo}>
          </div>
          <div style={styles.navbarLinks}>

          </div>
        </div>
        <div style={styles.centralBody}>
          <img src="http://salehriaz.com/404Page/img/404.svg" width="300px" style={styles.objectsImg} className="image-404" alt="404 Image" />
          <a href="/" className="btn-go-home" target="_blank" style={{...styles.btnGoHome, ':hover': styles.btnGoHomeHover}}>GO BACK</a>
        </div>
        <div style={styles.objects}>
          <img src="http://salehriaz.com/404Page/img/rocket.svg" width="40px" style={styles.objectRocket} className="object_rocket" alt="Rocket Image" />
          <div style={styles.earthMoon}>
            <img src="http://salehriaz.com/404Page/img/earth.svg" width="100px" style={styles.objectEarth} className="object_earth" alt="Earth Image" />
            <img src="http://salehriaz.com/404Page/img/moon.svg" width="80px" style={styles.objectMoon} className="object_moon" alt="Moon Image" />
          </div>
          <div style={styles.boxAstronaut} className="box_astronaut">
            <img src="http://salehriaz.com/404Page/img/astronaut.svg" width="140px" style={styles.objectAstronaut} alt="Astronaut Image" />
          </div>
        </div>
        <div style={styles.glowingStars} className="glowing_stars">
          <div style={{...styles.star, animation: 'glow-star 2s infinite ease-in-out alternate 1s'}}> </div>
          <div style={{...styles.star, animation: 'glow-star 2s infinite ease-in-out alternate 3s'}}> </div>
          <div style={{...styles.star, animation: 'glow-star 2s infinite ease-in-out alternate 5s'}}> </div>
          <div style={{...styles.star, animation: 'glow-star 2s infinite ease-in-out alternate 7s'}}> </div>
          <div style={{...styles.star, animation: 'glow-star 2s infinite ease-in-out alternate 9s'}}> </div>
        </div>
      </div>
    </body>
    </div>


  );
};

export default Empty;
