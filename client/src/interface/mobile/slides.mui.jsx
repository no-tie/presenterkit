import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { Icon } from '../../components/core.cmp'
import { STApp, STMobile } from '../../stores/app.store'

import sty from '../../styles/modules/mobile.module.css'


export const Slides = () => {
    const appSnap = useSnapshot(STApp)
    const mobileSnap = useSnapshot(STMobile)


    const downloadPdf = (file) => {
        window.open(`http://${appSnap.host.ip}:${appSnap.host.port2}/uploads/pdfs/${file}.pdf`, '_blank')
    }

    const playSlide = (index) => {
        if (index === appSnap.activeSlide.index) return STApp.showTheatre = true
        if (appSnap.playSlide.index !== index) STApp.playSlide.page = 1
        STApp.playSlide.index = index
        STApp.showPages = true
    }

    const toggleCloseBtn = () => {
        if (mobileSnap.showCloseBtn) {
            STMobile.showCloseBtn = false
        } else {
            STMobile.showCloseBtn = true
            setTimeout(() => STMobile.showCloseBtn = false, 3000)
        }
    }


    useEffect(() => {
        appSnap.showTheatre && setTimeout(() => STMobile.showCloseBtn = false, 3000)
    }, [appSnap.showTheatre])


    return (
        <AnimatePresence mode='wait'>
            {appSnap.uiName === 'Slides' && <>
                <AnimatePresence>
                    {appSnap.showTheatre && <motion.div className={sty.theatre}
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ ease: 'easeInOut', duration: 0.3 }}
                        style={{ backgroundImage: `url(http://${appSnap.host.ip}:${appSnap.host.port2}/uploads/imgs/${appSnap.slides[appSnap.activeSlide.index].name}/${appSnap.activeSlide.page}.png)` }}
                        onClick={() => toggleCloseBtn()}
                    >
                        {mobileSnap.showCloseBtn && <button className={sty.theatreCloseBtn} onClick={() => STApp.showTheatre = false}>
                            <Icon name='close' size={20} color='--white' />
                        </button>}
                    </motion.div>}
                </AnimatePresence>
                {!appSnap.showTheatre && <motion.div className={sty.modalView}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ ease: 'easeInOut', duration: 0.3 }}
                >
                    <div className={sty.modal}>
                        <div className={sty.modalHeader}>
                            {appSnap.showPages
                                ? <>
                                    <div className={sty.modalLblView}>
                                        <button className={sty.modalHeadBtn} onClick={() => STApp.showPages = false}>
                                            <Icon name='chevron-back' size={20} color='--primary-tint' />
                                        </button>
                                    </div>
                                    {appSnap.activeSlide.index === appSnap.playSlide.index
                                        ? <div className={sty.slideHeaderLive}>
                                            <Icon name='radio-button-on' size={20} color='--system-red' />
                                            <h3 className={sty.slidePageCount} style={{ marginLeft: 5 }}>Live</h3>
                                        </div>
                                        : <h3 className={sty.slidePageCount}>{`${appSnap.slides[appSnap.playSlide.index].pageCount} pages`}</h3>
                                    }
                                    <button className={sty.modalHeadBtn} onClick={() => downloadPdf(appSnap.slides[appSnap.playSlide.index].name)}>
                                        <Icon name='arrow-down' size={20} color='--primary-tint' />
                                    </button>
                                </>
                                : <>
                                    <div className={sty.modalLblView}>
                                        {appSnap.slides.length !== 0 && <div className={sty.modalCountBg}>
                                            <h1 className={sty.modalCount}>{appSnap.slides.length}</h1>
                                        </div>}
                                        <h3 className={sty.modalHeaderLbl}>Slides</h3>
                                    </div>
                                    <button className={sty.modalHeadBtn} onClick={() => STApp.uiName = ''}>
                                        <Icon name='close' size={20} color='--white' />
                                    </button>
                                </>
                            }
                        </div>
                        <AnimatePresence>
                            {!appSnap.showPages && <>
                                {appSnap.slides.length
                                    ? <motion.div className={sty.slides}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ ease: 'easeInOut', duration: 0.2 }}
                                    >
                                        {appSnap.slides.map((slide, index) => {
                                            return (
                                                <div className={sty.slideItem} key={index} onClick={() => playSlide(index)}>
                                                    <img className={sty.slideItemImg} src={`http://${appSnap.host.ip}:${appSnap.host.port2}/uploads/imgs/${slide.name}/${appSnap.activeSlide.index === index ? appSnap.activeSlide.page : 1}.png`} />
                                                    {appSnap.activeSlide.index === index && <div className={sty.slideItemLive}>
                                                        <Icon name='radio-button-on' size={20} color='--system-red' />
                                                    </div>}
                                                </div>
                                            )
                                        })}
                                    </motion.div>
                                    : <div className={sty.modalEmpty}>
                                        <h3 className={sty.modalEmptyTtl}>No Slides Shared</h3>
                                        <h5 className={sty.modalEmptySbtl} onClick={() => STApp.uiName = ''}>Presenter could upload soon.</h5>
                                    </div>
                                }
                            </>}
                        </AnimatePresence>
                        <AnimatePresence>
                            {appSnap.showPages && <motion.div className={sty.slidePages}
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ ease: 'easeInOut', duration: 0.3 }}
                            >
                                {Array(appSnap.slides[appSnap.playSlide.index].pageCount).fill().map((page, index) => {
                                    return (
                                        <div key={index} className={sty.slidePage} onClick={() => { STApp.activeSlide.page = (index + 1) }}
                                            style={{ backgroundColor: appSnap.activeSlide.index === appSnap.playSlide.index && appSnap.activeSlide.page === index + 1 ? 'var(--system-yellow)' : 'var(--primary-fill)' }}>
                                            <img className={sty.slidePageImg} src={`http://${appSnap.host.ip}:${appSnap.host.port2}/uploads/imgs/${appSnap.slides[appSnap.playSlide.index].name}/${index + 1}.png`} />
                                            <h5 className={sty.slidePageNumber}>{index + 1}</h5>
                                        </div>
                                    )
                                })}
                            </motion.div>}
                        </AnimatePresence>
                    </div>
                </motion.div>}
            </>}
        </AnimatePresence>
    )
}