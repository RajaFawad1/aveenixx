import HeaderUtility from './HeaderUtility';

export default function StickyHeaderGeneric() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-white dark:bg-gray-900 shadow overflow-x-hidden">
      <HeaderUtility />
    </div>
  );
}