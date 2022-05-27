import { navigations } from '@shared/constant';
import {
  checkActiveNav,
  permissionChecker,
} from '@shared/custom-function/common';
import { ISidebarNav, NavCommon } from '@shared/interfaces';
import clsx from 'clsx';
import useDebounce from 'hooks/use-debounce';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { deTrackerActions } from 'store/admin/de-trackers/de-trackers.actions';
import { DETrackerState } from 'store/admin/de-trackers/de-trackers.reducers';
import { StoreState } from 'store/root-reducer';

export interface ISidebar extends DETrackerState {
  isShow: boolean;
  getPillarTrackerList: () => void;
  closeSelf: () => void;
}

function Sidebar(props: ISidebar): JSX.Element {
  const { isShow, listPillars, closeSelf, getPillarTrackerList } = props;

  const router = useRouter();

  const [navMenu, setNavMenu] = useState<ISidebarNav[]>(navigations());

  useDebounce(() => {
    getPillarTrackerList();
  }, listPillars);

  useEffect(() => {
    let index = 0;

    navMenu.forEach((e, i) => {
      if (router.pathname === e.href) {
        index = i;
      } else if (e.title === 'DE Progress Tracker' && router.query.id) {
        index = i;
      } else {
        e.items?.map((f) => {
          if (router.pathname.includes(f.href)) index = i;
        });
      }
    });

    if (listPillars.length) checkUserPermission(index);
  }, [listPillars]);

  const checkUserPermission = (activeNavIndex: number): void => {
    let filteredNav: ISidebarNav[] = [];

    // filter the nav with the user permission
    navMenu.forEach((e) => {
      // check if the user is permitted to view the nav
      // if nav has no permission let user see it
      if (permissionChecker(String(e.permission)) || !e.permission) {
        // push the valu∫e that has a permission
        filteredNav.push(e);
      }
    });

    // filter the sub nav and check for other values to include in the final array of navs that user will see
    const finalFilter = filteredNav.map((e) => {
      // check if href is de tracker
      if (e.title === 'DE Progress Tracker') {
        return {
          ...e,
          // insert the new navs of DE tracker
          items: listPillars?.map((d) => {
            // retun a generated sub nav
            return {
              href: `/admin/de-progress-tracker/${d?.id}`,
              title: d?.name,
            };
          }),
        };
      }

      // sanity check
      if (e.items?.length) {
        const items: NavCommon[] = e.items.filter((f) => {
          if (!f.permission) return f;

          // check if the sub item has permission
          if (permissionChecker(String(f.permission))) return f;
        });

        // return the filtered items
        return { ...e, items };
      } else {
        // return the navs that has no items
        return e;
      }
    });

    // set up menu
    setNavMenu(checkActiveNav(activeNavIndex, finalFilter));
  };

  const changeActiveNav = (index: number) => {
    const updateNavLink = checkActiveNav(index, navMenu);

    // set up updated nav
    setNavMenu(updateNavLink);
  };

  const subLinkClass = (subLink: NavCommon): string => {
    if (
      router?.query?.title === subLink.title ||
      router.pathname.startsWith(subLink.href)
    )
      return 'fw-bold subMenuActive';

    return 'fw-normal';
  };

  const subLinkURL = (menu: ISidebarNav, subLink: NavCommon): string => {
    if (menu.title === 'DE Progress Tracker') {
      return `${subLink.href}?title=${subLink.title}`;
    }

    return subLink.href;
  };

  return (
    <nav id="sidebar" className={clsx(isShow && 'customMenu')}>
      <div className="sidebar-header d-flex align-items-center">
        <img
          src="/assets/admin/logo.png"
          alt="logo"
          width={120}
          className="img-fliud"
        />
        <div
          onClick={closeSelf}
          className={`closeIcone cursor-pointer d-md-none ${
            isShow ? 'd-block' : 'd-none'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="#FFF"
          >
            <path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z" />
          </svg>
        </div>
      </div>
      <div className="nav-list">
        <ul className="list-unstyled components mx-3 my-4">
          {navMenu.map((menu, index) => {
            return (
              <li key={index} className="my-2">
                <Link href={menu.href}>
                  <a
                    onClick={() => changeActiveNav(index)}
                    className={clsx(menu.isActive && 'nav-active')}
                  >
                    <img
                      src={menu.icon}
                      alt="icon"
                      className="icon-menu me-2"
                    />
                    {menu.title}
                    {menu?.items && (
                      <div
                        className={`${
                          menu.isSubNavOpen ? 'arrow-up' : 'arrow-down'
                        }`}
                      >
                        <ArrowSVG />
                      </div>
                    )}
                  </a>
                </Link>

                <ul
                  className={clsx(
                    'nav flex-column',
                    menu.isSubNavOpen && 'navShow',
                  )}
                >
                  {menu?.items?.map((item, i) => {
                    return (
                      <li key={i} className="nav-item ps-4 cursor-pointer">
                        <Link href={subLinkURL(menu, item)}>
                          <a className={subLinkClass(item)}>
                            <span className="title">{item.title}</span>
                          </a>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

const ArrowSVG = () => {
  return (
    <div className="h-4 w-4 arrow-filter">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 36 36"
        stroke="#fff"
        height="27"
        width="27"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  );
};

const mapStateToProps = (store: StoreState) => {
  return { ...store?.deTrackers };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { getPillarsListAction } = deTrackerActions;

  return {
    getPillarTrackerList: () => dispatch(getPillarsListAction()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
