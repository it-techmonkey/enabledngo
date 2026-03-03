'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Heart, DollarSign, Users, Instagram } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Gallery data extracted from the original site
const IMAGES = {
  OB: ["2024-04-07_11-11-55_UTC_2.webp", "2024-04-07_11-11-55_UTC_3.webp", "2024-04-07_11-11-55_UTC_4.webp"],
  DB: ["2024-05-25_11-21-44_UTC_2.webp", "2024-05-25_11-21-44_UTC_3.webp"],
  MB: ["2024-07-03_09-50-35_UTC_2.webp"],
  IB: ["2024-07-04_05-37-39_UTC_2.webp"],
  PB: ["2024-07-10_12-35-08_UTC_2.webp"],
  LB: ["2024-07-10_12-38-37_UTC_2.webp"],
  UB: ["2024-07-13_11-56-51_UTC_2.webp", "2024-07-13_11-56-51_UTC_3.webp"],
  VB: ["2024-09-03_09-07-24_UTC_2.webp", "2024-09-03_09-07-24_UTC_3.webp", "2024-09-03_09-07-24_UTC_4.webp"],
  BB: ["2024-09-04_01-34-22_UTC_2.webp"],
  zB: ["2024-08-26_00-29-23_UTC_2.webp"],
  FB: ["2024-09-06_04-11-03_UTC_2.webp"],
  HB: ["2024-08-29_01-56-50_UTC_2.webp", "2024-08-29_01-56-50_UTC_3.webp", "2024-08-29_01-56-50_UTC_4.webp", "2024-08-29_01-56-50_UTC_5.webp", "2024-08-29_01-56-50_UTC_6.webp"],
  qB: ["2024-09-12_05-24-08_UTC_2.webp", "2024-09-12_05-24-08_UTC_3.webp", "2024-09-12_05-24-08_UTC_4.webp"],
  $B: ["2024-09-02_04-28-24_UTC_2.webp", "2024-09-02_04-28-24_UTC_3.webp", "2024-09-02_04-28-24_UTC_4.webp", "2024-09-02_04-28-24_UTC_5.webp"],
  GB: ["2022-12-23_12-33-37_UTC_2.webp", "2022-12-23_12-33-37_UTC_3.webp", "2022-12-23_12-33-37_UTC_4.webp", "2022-12-23_12-33-37_UTC_5.webp", "2022-12-23_12-33-37_UTC_6.webp"],
  KB: ["2023-01-06_06-13-41_UTC_2.webp", "2023-01-06_06-13-41_UTC_3.webp", "2023-01-06_06-13-41_UTC_4.webp"],
  YB: ["2023-01-13_04-40-12_UTC_2.webp", "2023-01-13_04-40-12_UTC_3.webp", "2023-01-13_04-40-12_UTC_4.webp"],
  ZB: ["2023-02-20_08-21-23_UTC_2.webp", "2023-02-20_08-21-23_UTC_3.webp"],
  QB: ["2023-02-05_02-38-12_UTC_2.webp", "2023-02-05_02-38-12_UTC_3.webp", "2023-02-05_02-38-12_UTC_4.webp", "2023-02-05_02-38-12_UTC_5.webp"],
  XB: ["2023-02-27_13-44-27_UTC_2.webp", "2023-02-27_13-44-27_UTC_3.webp", "2023-02-27_13-44-27_UTC_4.webp", "2023-02-27_13-44-27_UTC_5.webp", "2023-02-27_13-44-27_UTC_6.webp", "2023-02-27_13-44-27_UTC_7.webp", "2023-02-27_13-44-27_UTC_8.webp"],
  WB: ["2023-04-05_08-30-26_UTC_2.webp", "2023-04-05_08-30-26_UTC_3.webp"],
  JB: ["2023-04-05_08-31-27_UTC_2.webp", "2023-04-05_08-31-27_UTC_3.webp", "2023-04-05_08-31-27_UTC_4.webp"],
  ez: ["2023-04-05_08-29-12_UTC_2.webp", "2023-04-05_08-29-12_UTC_3.webp", "2023-04-05_08-29-12_UTC_4.webp", "2023-04-05_08-29-12_UTC_5.webp"],
  tz: ["2023-05-02_09-01-10_UTC_2.webp"],
  nz: ["2023-05-25_08-15-12_UTC_2.webp", "2023-05-25_08-15-12_UTC_3.webp", "2023-05-25_08-15-12_UTC_4.webp", "2023-05-25_08-15-12_UTC_5.webp", "2023-05-25_08-15-12_UTC_6.webp", "2023-05-25_08-15-12_UTC_7.webp", "2023-05-25_08-15-12_UTC_8.webp", "2023-05-25_08-15-12_UTC_9.webp"],
  sz: ["2023-05-25_08-34-33_UTC_2.webp"],
  iz: ["2023-08-29_03-54-31_UTC_2.webp", "2023-08-29_03-54-31_UTC_3.webp"],
  az: ["2023-10-20_07-14-49_UTC_2.webp", "2023-10-20_07-14-49_UTC_3.webp", "2023-10-20_07-14-49_UTC_4.webp"],
  rz: ["2024-10-10_08-00-53_UTC_2.webp", "2024-10-10_08-00-53_UTC_3.webp"],
  oz: ["2024-10-02_08-42-19_UTC_2.webp"],
  lz: ["2024-11-01_07-52-46_UTC_2.webp"],
  cz: ["2024-10-23_07-43-40_UTC_2.webp", "2024-10-23_07-43-40_UTC_3.webp", "2024-10-23_07-43-40_UTC_4.webp", "2024-10-23_07-43-40_UTC_5.webp"],
  uz: ["2024-10-25_05-07-31_UTC_2.webp", "2024-10-25_05-07-31_UTC_3.webp"],
  dz: ["2024-11-19_06-22-57_UTC_2.webp", "2024-11-19_06-22-57_UTC_3.webp", "2024-11-19_06-22-57_UTC_4.webp", "2024-11-19_06-22-57_UTC_5.webp", "2024-11-19_06-22-57_UTC_6.webp"],
  fz: ["2024-12-04_05-52-28_UTC_2.webp", "2024-12-04_05-52-28_UTC_3.webp"],
  hz: ["2024-12-18_10-50-16_UTC_2.webp", "2024-12-18_10-50-16_UTC_3.webp", "2024-12-18_10-50-16_UTC_4.webp"],
  mz: ["2024-12-09_09-31-02_UTC_2.webp"],
  pz: ["2024-12-09_10-36-34_UTC_2.webp", "2024-12-09_10-36-34_UTC_3.webp"],
  gz: ["2025-01-15_11-26-53_UTC_2.webp"],
  yz: ["2024-12-26_06-16-34_UTC_2.webp"],
  vz: ["2025-01-11_07-48-57_UTC_2.webp", "2025-01-11_07-48-57_UTC_3.webp", "2025-01-11_07-48-57_UTC_4.webp"],
  bz: ["2025-01-21_07-28-17_UTC_2.webp", "2025-01-21_07-28-17_UTC_3.webp"],
  xz: ["2025-03-05_13-50-23_UTC_2.webp"],
  _z: ["2025-03-11_09-40-57_UTC_2.webp"],
  wz: ["2025-03-23_10-13-27_UTC_2.webp", "2025-03-23_10-13-27_UTC_3.webp", "2025-03-23_10-13-27_UTC_4.webp", "2025-03-23_10-13-27_UTC_5.webp"],
  Tz: ["2025-03-26_06-23-21_UTC_2.webp"],
  Sz: ["2025-03-27_10-53-07_UTC_2.webp", "2025-03-27_10-53-07_UTC_3.webp", "2025-03-27_10-53-07_UTC_4.webp", "2025-03-27_10-53-07_UTC_5.webp", "2025-03-27_10-53-07_UTC_6.webp", "2025-03-27_10-53-07_UTC_7.webp", "2025-03-27_10-53-07_UTC_8.webp"],
  Ez: ["2025-04-25_02-22-43_UTC_2.webp"],
  Cz: ["2025-04-22_13-13-56_UTC_2.webp"],
  Nz: ["2025-05-19_01-00-00_UTC_2.webp", "2025-05-19_01-00-00_UTC_3.webp", "2025-05-19_01-00-00_UTC_4.webp", "2025-05-19_01-00-00_UTC_5.webp"],
  jz: ["2025-05-02_11-13-37_UTC_2.webp"],
  Az: ["2025-05-05_02-35-42_UTC_2.webp", "2025-05-05_02-35-42_UTC_3.webp", "2025-05-05_02-35-42_UTC_4.webp"],
  Rz: ["2025-05-06_02-00-00_UTC_2.webp"],
  kz: ["2025-06-05_10-51-10_UTC_2.webp"],
  Oz: ["2025-07-09_01-00-00_UTC_2.webp", "2025-07-09_01-00-00_UTC_3.webp"],
  Dz: ["2025-06-20_02-58-48_UTC_2.webp"],
  Mz: ["2025-07-04_11-35-23_UTC_2.webp"],
  Iz: ["2025-06-25_01-08-05_UTC_2.webp"],
  Pz: ["2025-07-07_03-12-09_UTC_2.webp", "2025-07-07_03-12-09_UTC_3.webp"],
  Lz: ["2025-07-23_10-37-55_UTC_2.webp"],
  Uz: ["2025-07-14_05-00-47_UTC_2.webp"],
  Vz: ["2025-07-31_02-00-00_UTC_2.webp"],
  Bz: ["2025-08-11_10-39-51_UTC_2.webp"],
  zz: ["2025-08-21_09-43-19_UTC_2.webp"],
  Fz: ["2025-08-22_01-00-00_UTC_2.webp", "2025-08-22_01-00-00_UTC_3.webp", "2025-08-22_01-00-00_UTC_4.webp", "2025-08-22_01-00-00_UTC_5.webp"],
  Hz: ["2025-08-23_03-00-00_UTC_2.webp"],
  qz: ["2025-09-23_03-32-11_UTC_2.webp"],
  $z: ["2025-09-18_08-13-53_UTC_2.webp"],
  Gz: ["2025-09-19_02-00-00_UTC_2.webp", "2025-09-19_02-00-00_UTC_3.webp", "2025-09-19_02-00-00_UTC_4.webp"],
  Kz: ["2025-10-17_02-56-53_UTC_2.webp"],
  Yz: ["2025-10-06_02-55-08_UTC_2.webp"],
  Zz: ["2025-10-07_02-10-00_UTC_2.webp"],
  Qz: ["2025-10-10_09-15-15_UTC_2.webp"],
  Xz: ["2025-09-30_02-25-00_UTC_2.webp"],
  Wz: ["2025-10-11_01-40-00_UTC_2.webp"],
  Jz: ["2025-11-08_10-30-19_UTC_2.webp"],
  eF: ["2025-11-18_02-31-18_UTC_2.webp"]
};

// Instagram embed URL – posts load directly from Instagram, no file hosting or downloads
const instaEmbedUrl = (postId) => `https://www.instagram.com/p/${postId}/embed/`;

// Mapping keys to their respective image count (for badge)
const ai = {
  C5dUfGfy1uS: IMAGES.OB,
  "C78-H1dSMwZ": ["2024-06-08_11-14-59_UTC_10.webp", "2024-06-08_11-14-59_UTC_2.webp", "2024-06-08_11-14-59_UTC_3.webp", "2024-06-08_11-14-59_UTC_4.webp", "2024-06-08_11-14-59_UTC_5.webp", "2024-06-08_11-14-59_UTC_6.webp", "2024-06-08_11-14-59_UTC_7.webp", "2024-06-08_11-14-59_UTC_8.webp", "2024-06-08_11-14-59_UTC_9.webp"],
  "C7oBhxoS2h-": ["2024-05-31_08-00-42_UTC_2.webp"],
  C7Y7xB_SNKS: IMAGES.DB,
  C89MViDyllY: IMAGES.MB,
  C8_UL48S29k: IMAGES.IB,
  "C99CBj-yo56": ["2024-07-28_04-51-52_UTC_2.webp"],
  C9Pgu2rSv6l: IMAGES.PB,
  C9PhIWGyFB0: IMAGES.LB,
  C9XKvB3yYXR: IMAGES.UB,
  C_cwrfBSRvt: IMAGES.VB,
  C_ehoMyygmk: IMAGES.BB,
  C_HPCYJSSr7: IMAGES.zB,
  C_j9Jnbyaaw: IMAGES.FB,
  C_PHbfyyDnH: IMAGES.HB,
  C_ziSGXy7_7: IMAGES.qB,
  C_Zr9KSSJQF: IMAGES.$B,
  CmgrbTIyugj: IMAGES.GB,
  CnEDE6tSElW: IMAGES.KB,
  CnV58S4yVKS: IMAGES.YB,
  Co4JdnIy5uN: IMAGES.ZB,
  CoQ6Q1mSGfU: IMAGES.QB,
  CpKv_4vSJQ7: IMAGES.XB,
  CqpdeWWvwTg: IMAGES.WB,
  Cqpdl1UPxYV: IMAGES.JB,
  CqpdVPtvHLP: IMAGES.ez,
  CrvCdGyyl2M: IMAGES.tz,
  CsqLefsShGd: IMAGES.nz,
  CsqNsMrSEg8: IMAGES.sz,
  Cwg59M7y3Xx: IMAGES.iz,
  CynKNx9Snv5: IMAGES.az,
  "DA-GWATSvDj": ["2024-10-11_04-23-02_UTC_2.webp"],
  "DA2vbs-yWEw": ["2024-10-08_07-48-09_UTC_2.webp", "2024-10-08_07-48-09_UTC_3.webp", "2024-10-08_07-48-09_UTC_4.webp", "2024-10-08_07-48-09_UTC_5.webp"],
  DA76erayESX: IMAGES.rz,
  DAnY3Iuy7Xv: IMAGES.oz,
  DB0jCeJyTAc: IMAGES.lz,
  DBdW15SSK3Q: IMAGES.cz,
  DBiOkD_SdN2: IMAGES.uz,
  "DBxPP-eyTk2": ["2024-10-31_01-02-08_UTC_2.webp", "2024-10-31_01-02-08_UTC_3.webp", "2024-10-31_01-02-08_UTC_4.webp"],
  "DC-uRlWSaPp": ["2024-11-30_03-14-45_UTC_2.webp"],
  DCivEbSSnzu: IMAGES.dz,
  DDJTgPsScT0: IMAGES.fz,
  "DDorN4-S_dc": ["2024-12-16_10-16-08_UTC_2.webp", "2024-12-16_10-16-08_UTC_3.webp", "2024-12-16_10-16-08_UTC_4.webp"],
  DDt4toWS_vP: IMAGES.hz,
  DDWkfcsy8Kj: IMAGES.mz,
  DDWr_dRSCLx: IMAGES.pz,
  DE2DKX3y1Zd: IMAGES.gz,
  DEB_v_qyU5e: IMAGES.yz,
  DErXCrtyTJY: IMAGES.vz,
  DFFEoApSRYN: IMAGES.bz,
  DG0eiPPz4KH: IMAGES.xz,
  DHDewoLRlnJ: IMAGES._z,
  DHicBI0xKYY: IMAGES.wz,
  DHpwEfDxWk9: IMAGES.Tz,
  DHszvFKTLof: IMAGES.Sz,
  DI2kYSdzzms: IMAGES.Ez,
  DIwAhSAz4q1: IMAGES.Cz,
  DJ0N_dUTriR: IMAGES.Nz,
  DJJisvtznoy: IMAGES.jz,
  DJQV0GxzOhs: IMAGES.Az,
  DJS2ixKTErB: IMAGES.Rz,
  DKhDKJ9xuG2: IMAGES.kz,
  DL3io4LzBMI: IMAGES.Oz,
  DLG1BhbRnV5: IMAGES.Dz,
  DLrzRYgRIPE: IMAGES.Mz,
  DLTgU_yzt56: IMAGES.Iz,
  DLyoEIERgd1: IMAGES.Pz,
  DMcnzAqRuhf: IMAGES.Lz,
  DME2D5PRiE3: IMAGES.Uz,
  DMwS8faT9_W: IMAGES.Vz,
  DNNjHy_xDDT: IMAGES.Bz,
  DNnMmk4xnF6: IMAGES.zz,
  DNo1mQaR_xQ: IMAGES.Fz,
  DNroFL7RqSw: IMAGES.Hz,
  DO7gXHTkafe: IMAGES.qz,
  "DO93N-vkYiR": ["2025-09-24_01-30-00_UTC_2.webp"],
  DOvIn9AkcCK: IMAGES.$z,
  DOxCt_qk1O_: IMAGES.Gz,
  DP5PZlFkb0g: IMAGES.Kz,
  DPc6dIuEcN9: IMAGES.Yz,
  DPfaJzGEa9M: IMAGES.Zz,
  "DPK5e-PkZUm": ["2025-09-29_03-00-19_UTC_2.webp"],
  DPn5ItbkeVN: IMAGES.Qz,
  DPNaT7oEfyN: IMAGES.Xz,
  DPpp1M8kVum: IMAGES.Wz,
  DQysx1xEfTa: IMAGES.Jz,
  DRLl6L0kwt1: IMAGES.eF
};

export default function DonationDistributionPage() {
  const [pageOffset, setPageOffset] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  const itemsPerPage = 8;
  const allPostIds = Object.keys(ai).sort();
  const totalPages = Math.ceil(allPostIds.length / itemsPerPage);
  const displayedPostIds = allPostIds.slice(pageOffset, pageOffset + itemsPerPage);

  const handlePrevPage = () => {
    setPageOffset(prev => Math.max(0, prev - itemsPerPage));
  };

  const handleNextPage = () => {
    setPageOffset(prev => Math.min(allPostIds.length - itemsPerPage, prev + itemsPerPage));
  };

  const openModal = (postId) => setSelectedPost(postId);
  const closeModal = () => setSelectedPost(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedPost && e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPost]);

  return (
    <div className="min-h-screen flex flex-col bg-white font-inter">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Donation Distribution</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our donation distribution program ensures that medical supplies and resources reach pediatric tracheostomy patients across Indonesia who need them most.
            </p>
          </motion.div>

          {/* Mission and Stories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                Enabled. focuses on purchasing tracheostomy tubes and redistributing surplus medical supplies from families in privileged settings or those grieving a loss. We ensure these vital resources reach children who need them most.
              </p>
              <p className="text-gray-600">
                Through heartfelt collaboration, we help these children live life to the fullest, providing essential medical equipment and support to families across Indonesia.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Impact Stories</h2>
              <p className="text-gray-600 mb-4">
                Follow our journey on Instagram to see real stories of families we've helped and the impact of your donations in action.
              </p>
              <div className="flex items-center justify-center">
                <a
                  href="https://www.instagram.com/enabled.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Instagram className="w-5 h-5 mr-2" />
                  Follow Us on Instagram
                </a>
              </div>
            </div>
          </motion.div>

          {/* Gallery Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Our Impact in Action</h2>
            <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
              See the real stories and faces behind our donation distribution efforts. Each post represents a family we've helped through medical supplies and support.
            </p>

            <div className="relative">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {displayedPostIds.map((postId, index) => {
                  const count = ai[postId]?.length ?? 1;
                  return (
                    <motion.div
                      key={postId}
                      className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer ring-2 ring-transparent hover:ring-purple-400"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => openModal(postId)}
                    >
                      <iframe
                        src={instaEmbedUrl(postId)}
                        title={`Instagram post ${postId}`}
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        loading="lazy"
                        style={{ border: 0 }}
                      />
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                        <span className="text-white text-sm font-semibold">View post</span>
                      </div>
                      {count > 1 && (
                        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 pointer-events-none">
                          <Users className="w-3 h-3" />
                          {count}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handlePrevPage}
                  disabled={pageOffset === 0}
                  className={`p-3 rounded-full ${pageOffset === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl"} transition-all duration-200`}
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="text-gray-600 font-semibold">
                  {Math.floor(pageOffset / itemsPerPage) + 1} / {totalPages}
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={pageOffset >= allPostIds.length - itemsPerPage}
                  className={`p-3 rounded-full ${pageOffset >= allPostIds.length - itemsPerPage ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl"} transition-all duration-200`}
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Page Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPageOffset(i * itemsPerPage)}
                    className={`h-2 rounded-full transition-all duration-300 ${Math.floor(pageOffset / itemsPerPage) === i ? "w-8 bg-gradient-to-r from-purple-600 to-pink-600" : "w-2 bg-gray-300 hover:bg-gray-400"}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Modal Overlay */}
          <AnimatePresence>
            {selectedPost && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                onClick={closeModal}
              >
                <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={closeModal}
                    className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                  >
                    <X size={32} />
                  </button>

                  <div className="relative bg-white rounded-lg overflow-hidden">
                    <div className="relative w-full bg-gray-100" style={{ minHeight: '480px' }}>
                      <iframe
                        src={instaEmbedUrl(selectedPost)}
                        title={`Instagram post ${selectedPost}`}
                        className="w-full border-0"
                        style={{ height: '580px' }}
                      />
                    </div>
                    <div className="p-4 bg-white border-t flex items-center justify-between flex-wrap gap-3">
                      <p className="text-gray-600 text-sm">Instagram post</p>
                      <a
                        href={`https://www.instagram.com/p/${selectedPost}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                      >
                        <Instagram className="w-4 h-4" />
                        View on Instagram
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Assistance Options */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">How You Can Help</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Donate Medical Supplies</h3>
                <p className="text-gray-600">Contribute unused medical equipment to help families in need</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Provide Financial Support</h3>
                <p className="text-gray-600">Your donations help us purchase essential medical equipment</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Spread Awareness</h3>
                <p className="text-gray-600">Help us reach more families who need support</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
