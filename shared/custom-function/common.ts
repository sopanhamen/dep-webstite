import { ELanguage, EStatus, ETextColor } from '@shared/enum';
import { IAction, IMetadata, ISidebarNav } from '@shared/interfaces';
import * as _ from 'lodash';
import { isArray } from 'lodash';
import store from 'store';

/**
 *
 * @param metadata - type of IMetadata
 * @returns current active page of the Pagination
 */
export const activePage = (metadata: IMetadata): number => {
  // get quotient
  const quotient = Number(metadata.offset) / Number(metadata.limit);

  // add one since pagination starts at 1, and quotient initial value is zero
  return Math.ceil(quotient) + 1;
};

/**
 *
 * @param object - you want to be formatted to remove the falsey values
 * @returns formatted value of object without the falsey values
 */
export function removeFalseyObject(object: any) {
  // remove all object that has no value
  // DOCS: https://stackoverflow.com/questions/38275753/how-to-remove-empty-values-from-object-using-lodash
  return _.omitBy(object, (v) => _.isUndefined(v) || _.isNull(v) || v === '');
}

export function getLanguage() {
  const queryString = window.location.pathname;
  return queryString.startsWith('/km') ? ELanguage.KHMER : ELanguage.ENGLISH;
}

export function getLocale(englishText: string = '', khmerText: string = '') {
  return getLanguage() === ELanguage.ENGLISH ? englishText : khmerText;
}

/**
 *
 * @param base64 - base64File, file to be downloaded.
 * @param filename - string, name of the file to be downloaded.
 * @param extension - string, extension of the file to be downloaded.
 * @returns void, open new tab and download file.
 */
export function downloadBase64(
  base64: string,
  filename: string,
  extension: string,
) {
  return new Promise((resolve, reject) => {
    try {
      /*=== convert base64 to valid file ===*/
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      /*====================================*/

      const blob = new Blob([byteArray]);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = `${filename}.${extension}`;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      resolve({ base64, filename, extension });
    } catch (err: unknown) {
      reject(err);
    }
  });
}

/**
 *
 * @param userPermission page permission for checking
 * @returns boolean value
 */
export function permissionChecker(userPermission: string | string[]): boolean {
  const permissions = store?.state?.getState()?.auth?.user?.permissions;

  if (isArray(userPermission)) {
    const checker = userPermission.map((e) => permissions?.includes(e));

    // check if there is a true value
    return checker.some((e) => e);
  } else {
    return Boolean(permissions?.includes(userPermission));
  }
}

/**
 *
 * @param index current index of the active nav
 * @param currentNav current value of the nav
 * @returns a new set of nav with tye ISidebarNav
 */
export function checkActiveNav(
  index: number,
  currentNav: ISidebarNav[],
): ISidebarNav[] {
  return currentNav.map((e, i) => {
    if (i === index) {
      return {
        ...e,
        // check which side nav is active
        isActive: true,
        // check first if menu has a items then set isSubNavOpen
        isSubNavOpen: checkIfSubNavIsActive(e),
      };
    } else {
      // return to normal view
      return { ...e, isActive: false, isSubNavOpen: false };
    }
  });
}

// check which side nav is active
const checkIfSubNavIsActive = (e: ISidebarNav): boolean => {
  // check if it's de tracker, since de tracker nav is coming from the API
  if (e.title === 'DE Progress Tracker' || e.items?.length) {
    return !e.isSubNavOpen;
  }

  return false;
};

/**
 *
 * @param status current status
 * @param permissions permission that the page have
 * @returns
 */
export function commonMoreOptionToDisplay(
  status: string,
  permissions: string[] | string,
): IAction[] {
  let value: IAction[] = [
    {
      name: 'Edit',
      color: ETextColor.BLUE,
    },
  ];

  if (permissionChecker(permissions)) {
    if (status === EStatus.ACTIVE) {
      value = [
        {
          name: 'Private',
          color: ETextColor.RED,
        },
      ];
    } else {
      value = [
        {
          name: 'Public',
          color: ETextColor.BLUE,
        },
      ];
    }
  }

  return value;
}

export const isValidPhoneNumber = (value: any) => {
  if (value.match(/0/)) {
    return false;
  } else {
    return true;
  }
};
